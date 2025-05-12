package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
)

type RetrievalController struct {
	RetrievalUsecase scene_audio_route_interface.RetrievalRepository
}

func NewRetrievalController(uc scene_audio_route_interface.RetrievalRepository) *RetrievalController {
	return &RetrievalController{RetrievalUsecase: uc}
}

func (c *RetrievalController) StreamHandler(ctx *gin.Context) {
	var req struct {
		MediaFileID string `form:"media_file_id" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMETERS",
			"message": "缺少必要参数: media_file_id",
		})
		return
	}

	filePath, err := c.RetrievalUsecase.GetStream(ctx.Request.Context(), req.MediaFileID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"code":    "RESOURCE_NOT_FOUND",
			"message": "音频文件不存在",
		})
		return
	}
	serveMediaFile(ctx, filePath, "audio/mpeg")
}

func (c *RetrievalController) DownloadHandler(ctx *gin.Context) {
	var req struct {
		MediaFileID string `form:"media_file_id" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMETERS",
			"message": "缺少必要参数: media_file_id",
		})
		return
	}

	filePath, err := c.RetrievalUsecase.GetStream(ctx.Request.Context(), req.MediaFileID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"code":    "RESOURCE_NOT_FOUND",
			"message": "音频文件不存在",
		})
		return
	}
	serveMediaFile(ctx, filePath, "audio/mpeg")
}

func (c *RetrievalController) CoverArtHandler(ctx *gin.Context) {
	var req struct {
		Type     string `form:"type" binding:"required,oneof=media album artist"`
		TargetID string `form:"target_id" binding:"required,hexadecimal,len=24"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMETERS",
			"message": "参数格式错误: type必须为media或album，target_id必须为24位十六进制",
		})
		return
	}

	filePath, err := c.RetrievalUsecase.GetCoverArt(ctx.Request.Context(), req.Type, req.TargetID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"code":    "COVER_NOT_FOUND",
			"message": "封面文件不存在",
		})
		return
	}

	ctx.Header("Content-Type", "image/jpeg")
	ctx.File(filePath)
}

func (c *RetrievalController) LyricsHandlerMetadata(ctx *gin.Context) {
	var req struct {
		MediaFileID string `form:"media_file_id" binding:"required,hexadecimal,len=24"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMETERS",
			"message": "参数格式错误: media_file_id必须为24位十六进制字符串",
		})
		return
	}

	lyricsContent, err := c.RetrievalUsecase.GetLyricsLrcMetaData(ctx.Request.Context(), req.MediaFileID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"code":    "LYRICS_NOT_FOUND",
			"message": "未找到关联的歌词内容",
		})
		return
	}

	ctx.Data(http.StatusOK, "text/plain; charset=utf-8", []byte(lyricsContent))
}
func (c *RetrievalController) LyricsHandlerFile(ctx *gin.Context) {
	var req struct {
		MediaFileID string `form:"media_file_id" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMETERS",
			"message": "缺少必要参数: media_file_id",
		})
		return
	}

	filePath, err := c.RetrievalUsecase.GetLyricsLrcMetaData(ctx.Request.Context(), req.MediaFileID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"code":    "RESOURCE_NOT_FOUND",
			"message": "歌词文件不存在",
		})
		return
	}
	serveTextFile(ctx, filePath)
}

func serveMediaFile(ctx *gin.Context, path string, contentType string) {
	// 增加范围请求支持
	file, err := os.Open(path)
	if err != nil {
		handleFileError(ctx, err)
		return
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"code":    "FILE_CLOSE_ERROR",
				"message": "关闭文件时发生错误",
			})
			return
		}
	}(file)

	fileInfo, _ := file.Stat()

	// 设置正确的内容长度
	ctx.Header("Content-Length", strconv.FormatInt(fileInfo.Size(), 10))

	// 支持范围请求
	ctx.Header("Accept-Ranges", "bytes")

	// 设置缓存控制
	ctx.Header("Cache-Control", "public, max-age=86400") // 24小时缓存

	// 自动识别内容类型
	if contentType == "" {
		contentType = detectContentType(path)
	}
	ctx.Header("Content-Type", contentType)

	// 支持直接文件服务
	ctx.File(path)
}
func detectContentType(path string) string {
	ext := filepath.Ext(path)
	switch ext {
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".mp3":
		return "audio/mpeg"
	case ".lrc":
		return "text/plain; charset=utf-8"
	default:
		return "application/octet-stream"
	}
}
func handleFileError(ctx *gin.Context, err error) {
	if os.IsNotExist(err) {
		ctx.JSON(http.StatusNotFound, gin.H{
			"code":    "FILE_NOT_FOUND",
			"message": "请求的资源不存在",
		})
	} else if os.IsPermission(err) {
		ctx.JSON(http.StatusForbidden, gin.H{
			"code":    "FILE_PERMISSION_DENIED",
			"message": "无权访问该资源",
		})
	} else {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code":    "FILE_SYSTEM_ERROR",
			"message": "文件系统错误",
		})
	}
}

// 文本文件服务
func serveTextFile(ctx *gin.Context, path string) {
	ctx.Header("Content-Type", "text/plain; charset=utf-8")
	ctx.File(path)
}
