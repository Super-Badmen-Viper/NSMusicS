package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

type PlaylistTrackController struct {
	PlaylistTrackUsecase scene_audio_route_interface.PlaylistTrackRepository
}

func NewPlaylistTrackController(uc scene_audio_route_interface.PlaylistTrackRepository) *PlaylistTrackController {
	return &PlaylistTrackController{PlaylistTrackUsecase: uc}
}

// GetPlaylistTracks 获取播放列表曲目
func (c *PlaylistTrackController) GetPlaylistTracks(ctx *gin.Context) {
	var params struct {
		Start      string `form:"start" binding:"required"`
		End        string `form:"end" binding:"required"`
		Sort       string `form:"sort" binding:"required"`
		Order      string `form:"order" binding:"required"`
		Search     string `form:"search"`
		Starred    string `form:"starred"`
		AlbumId    string `form:"albumId"`
		ArtistId   string `form:"artistId"`
		Year       string `form:"year"`
		PlaylistId string `form:"playlistId" binding:"required"`
	}

	if err := ctx.ShouldBind(&params); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMS",
			"message": "参数校验失败",
			"details": err.Error(),
		})
		return
	}

	mediaFiles, err := c.PlaylistTrackUsecase.GetPlaylistTrackItems(
		ctx.Request.Context(),
		params.End,
		params.Order,
		params.Sort,
		params.Start,
		params.Search,
		params.Starred,
		params.AlbumId,
		params.ArtistId,
		params.Year,
		params.PlaylistId,
	)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code":    "DATA_RETRIEVAL_FAILED",
			"message": "获取播放列表曲目失败",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.MediaFileListResponse{
		MediaFiles: mediaFiles,
		Count:      len(mediaFiles),
	})
}

// AddPlaylistTracks 添加曲目到播放列表
func (c *PlaylistTrackController) AddPlaylistTracks(ctx *gin.Context) {
	var req struct {
		PlaylistID   string `form:"playlist_id" binding:"required"`
		MediaFileIDs string `form:"media_file_ids" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMS",
			"message": "参数格式错误",
			"details": parseBindingError(err),
		})
		return
	}

	success, err := c.PlaylistTrackUsecase.AddPlaylistTrackItems(
		ctx.Request.Context(),
		req.PlaylistID,
		req.MediaFileIDs,
	)

	if err != nil {
		var finalMessage string
		if success { // 部分成功
			finalMessage = "部分曲目添加成功，部分重复项被忽略"
		} else {
			finalMessage = "曲目添加失败"
		}

		ctx.JSON(http.StatusOK, gin.H{
			"code":    "PARTIAL_SUCCESS",
			"message": finalMessage,
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code":    "SUCCESS",
		"message": "全部曲目添加成功",
	})
}

// RemovePlaylistTracks 从播放列表移除曲目
func (c *PlaylistTrackController) RemovePlaylistTracks(ctx *gin.Context) {
	var req struct {
		PlaylistID   string `form:"playlist_id" binding:"required"`
		MediaFileIDs string `form:"media_file_ids" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMS",
			"message": "参数格式错误",
			"details": parseBindingError(err),
		})
		return
	}

	success, err := c.PlaylistTrackUsecase.RemovePlaylistTrackItems(
		ctx.Request.Context(),
		req.PlaylistID,
		req.MediaFileIDs,
	)

	if err != nil {
		statusCode := http.StatusInternalServerError
		if strings.Contains(err.Error(), "invalid") {
			statusCode = http.StatusBadRequest
		}

		ctx.JSON(statusCode, gin.H{
			"code":    "REMOVE_TRACKS_FAILED",
			"message": "移除曲目失败",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": "SUCCESS",
		"data": gin.H{"success": success},
	})
}

// SortPlaylistTracks 排序播放列表曲目
func (c *PlaylistTrackController) SortPlaylistTracks(ctx *gin.Context) {
	var req struct {
		PlaylistID   string `form:"playlist_id" binding:"required"`
		MediaFileIDs string `form:"media_file_ids" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMS",
			"message": "参数格式错误",
			"details": parseBindingError(err),
		})
		return
	}

	success, err := c.PlaylistTrackUsecase.SortPlaylistTrackItems(
		ctx.Request.Context(),
		req.PlaylistID,
		req.MediaFileIDs,
	)

	if err != nil {
		statusCode := http.StatusInternalServerError
		if strings.Contains(err.Error(), "invalid") {
			statusCode = http.StatusBadRequest
		}

		ctx.JSON(statusCode, gin.H{
			"code":    "SORT_TRACKS_FAILED",
			"message": "排序曲目失败",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": "SUCCESS",
		"data": gin.H{"success": success},
	})
}

// 解析绑定错误详情
func parseBindingError(err error) string {
	if err == nil {
		return ""
	}

	// 示例解析逻辑，实际可根据项目需要扩展
	if strings.Contains(err.Error(), "required") {
		return "缺少必要参数"
	}
	if strings.Contains(err.Error(), "format") {
		return "参数格式错误"
	}
	return err.Error()
}
