package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
)

type RetrievalController struct {
	RetrievalUsecase scene_audio_route_interface.RetrievalRepository
}

func NewRetrievalController(uc scene_audio_route_interface.RetrievalRepository) *RetrievalController {
	return &RetrievalController{RetrievalUsecase: uc}
}

// 音频流处理
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

// 封面图处理
func (c *RetrievalController) CoverArtHandler(ctx *gin.Context) {
	var req struct {
		CoverArtID string `form:"cover_art_id" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMETERS",
			"message": "缺少必要参数: cover_art_id",
		})
		return
	}

	filePath, err := c.RetrievalUsecase.GetCoverArt(ctx.Request.Context(), req.CoverArtID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"code":    "RESOURCE_NOT_FOUND",
			"message": "封面文件不存在",
		})
		return
	}
	serveMediaFile(ctx, filePath, "image/jpeg")
}

// 歌词处理
func (c *RetrievalController) LyricsHandler(ctx *gin.Context) {
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

	filePath, err := c.RetrievalUsecase.GetLyricsLrc(ctx.Request.Context(), req.MediaFileID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"code":    "RESOURCE_NOT_FOUND",
			"message": "歌词文件不存在",
		})
		return
	}
	serveTextFile(ctx, filePath)
}

// 通用媒体文件服务
func serveMediaFile(ctx *gin.Context, path string, contentType string) {
	file, err := os.Open(path)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code":    "FILE_IO_ERROR",
			"message": "无法打开文件",
		})
		return
	}
	defer file.Close()

	fileInfo, _ := file.Stat()
	ctx.Header("Content-Type", contentType)
	ctx.Header("Content-Length", string(fileInfo.Size()))
	ctx.File(path)
}

// 文本文件服务
func serveTextFile(ctx *gin.Context, path string) {
	ctx.Header("Content-Type", "text/plain; charset=utf-8")
	ctx.File(path)
}
