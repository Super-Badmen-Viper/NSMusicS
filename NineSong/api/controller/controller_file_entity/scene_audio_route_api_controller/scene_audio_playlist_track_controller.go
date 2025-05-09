package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
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
		controller.ErrorResponse(ctx, http.StatusBadRequest, "INVALID_PARAMS", "参数校验失败: "+err.Error())
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
		controller.ErrorResponse(ctx, http.StatusInternalServerError, "DATA_RETRIEVAL_FAILED", "获取播放列表曲目失败: "+err.Error())
		return
	}

	controller.SuccessResponse(ctx, "mediaFiles", mediaFiles, len(mediaFiles))
}

func (c *PlaylistTrackController) AddPlaylistTracks(ctx *gin.Context) {
	var req struct {
		PlaylistID   string `form:"playlist_id" binding:"required"`
		MediaFileIDs string `form:"media_file_ids" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		controller.ErrorResponse(ctx, http.StatusBadRequest, "INVALID_PARAMS", "参数格式错误: "+parseBindingError(err))
		return
	}

	success, err := c.PlaylistTrackUsecase.AddPlaylistTrackItems(
		ctx.Request.Context(),
		req.PlaylistID,
		req.MediaFileIDs,
	)

	if err != nil {
		statusCode := http.StatusInternalServerError
		errorCode := "ADD_TRACKS_FAILED"
		if strings.Contains(err.Error(), "invalid") {
			statusCode = http.StatusBadRequest
			errorCode = "INVALID_REQUEST"
		}
		controller.ErrorResponse(ctx, statusCode, errorCode, err.Error())
		return
	}

	controller.SuccessResponse(ctx, "added", gin.H{"success": success}, 1)
}

func (c *PlaylistTrackController) RemovePlaylistTracks(ctx *gin.Context) {
	var req struct {
		PlaylistID   string `form:"playlist_id" binding:"required"`
		MediaFileIDs string `form:"media_file_ids" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		controller.ErrorResponse(ctx, http.StatusBadRequest, "INVALID_PARAMS", "参数格式错误: "+parseBindingError(err))
		return
	}

	success, err := c.PlaylistTrackUsecase.RemovePlaylistTrackItems(
		ctx.Request.Context(),
		req.PlaylistID,
		req.MediaFileIDs,
	)

	if err != nil {
		statusCode := http.StatusInternalServerError
		errorCode := "REMOVE_TRACKS_FAILED"
		if strings.Contains(err.Error(), "invalid") {
			statusCode = http.StatusBadRequest
			errorCode = "INVALID_REQUEST"
		}
		controller.ErrorResponse(ctx, statusCode, errorCode, err.Error())
		return
	}

	controller.SuccessResponse(ctx, "removed", gin.H{"success": success}, 1)
}

func (c *PlaylistTrackController) SortPlaylistTracks(ctx *gin.Context) {
	var req struct {
		PlaylistID   string `form:"playlist_id" binding:"required"`
		MediaFileIDs string `form:"media_file_ids" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		controller.ErrorResponse(ctx, http.StatusBadRequest, "INVALID_PARAMS", "参数格式错误: "+parseBindingError(err))
		return
	}

	success, err := c.PlaylistTrackUsecase.SortPlaylistTrackItems(
		ctx.Request.Context(),
		req.PlaylistID,
		req.MediaFileIDs,
	)

	if err != nil {
		statusCode := http.StatusInternalServerError
		errorCode := "SORT_TRACKS_FAILED"
		if strings.Contains(err.Error(), "invalid") {
			statusCode = http.StatusBadRequest
			errorCode = "INVALID_REQUEST"
		}
		controller.ErrorResponse(ctx, statusCode, errorCode, err.Error())
		return
	}

	controller.SuccessResponse(ctx, "sorted", gin.H{"success": success}, 1)
}

func parseBindingError(err error) string {
	if err == nil {
		return ""
	}
	if strings.Contains(err.Error(), "required") {
		return "缺少必要参数"
	}
	if strings.Contains(err.Error(), "format") {
		return "参数格式错误"
	}
	return err.Error()
}
