package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"net/http"
	"strings"
)

type PlaylistController struct {
	PlaylistUsecase scene_audio_route_interface.PlaylistRepository
}

func NewPlaylistController(uc scene_audio_route_interface.PlaylistRepository) *PlaylistController {
	return &PlaylistController{PlaylistUsecase: uc}
}

func (c *PlaylistController) GetPlaylists(ctx *gin.Context) {
	playlists, err := c.PlaylistUsecase.GetPlaylistsAll(ctx.Request.Context())
	if err != nil {
		ErrorResponse(ctx, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	SuccessResponse(ctx, "playlists", playlists, len(playlists))
}

func (c *PlaylistController) GetPlaylist(ctx *gin.Context) {
	var req struct {
		ID string `form:"id" binding:"required"`
	}

	if err := ctx.ShouldBindWith(&req, binding.Form); err != nil {
		ErrorResponse(ctx, http.StatusBadRequest, "MISSING_PARAMETER", "Missing ID parameter")
		return
	}

	playlist, err := c.PlaylistUsecase.GetPlaylist(ctx.Request.Context(), req.ID)
	if err != nil {
		ErrorResponse(ctx, http.StatusNotFound, "NOT_FOUND", "playlist not found")
		return
	}
	SuccessResponse(ctx, "playlist", playlist, 1)
}

func (c *PlaylistController) CreatePlaylist(ctx *gin.Context) {
	var req struct {
		Name    string `form:"name" binding:"required"`
		Comment string `form:"comment"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ErrorResponse(ctx, http.StatusBadRequest, "BINDING_ERROR", err.Error())
		return
	}

	newPlaylist := scene_audio_route_models.PlaylistMetadata{
		Name:    req.Name,
		Comment: req.Comment,
	}

	created, err := c.PlaylistUsecase.CreatePlaylist(ctx.Request.Context(), newPlaylist)
	if err != nil {
		ErrorResponse(ctx, http.StatusInternalServerError, "CREATION_FAILED", err.Error())
		return
	}
	SuccessResponse(ctx, "playlist", created, 1)
}

func (c *PlaylistController) UpdatePlaylist(ctx *gin.Context) {
	var req struct {
		ID      string `form:"id" binding:"required"`
		Name    string `form:"name" binding:"required"`
		Comment string `form:"comment"`
	}

	if err := ctx.ShouldBindWith(&req, binding.Form); err != nil {
		ErrorResponse(ctx, http.StatusBadRequest, "BINDING_ERROR", err.Error())
		return
	}

	updateData := scene_audio_route_models.PlaylistMetadata{
		Name:    req.Name,
		Comment: req.Comment,
	}

	updatedPlaylist, err := c.PlaylistUsecase.UpdatePlaylistInfo(ctx.Request.Context(), req.ID, updateData)
	if err != nil {
		if strings.Contains(err.Error(), "already exists") {
			ErrorResponse(ctx, http.StatusConflict, "NAME_CONFLICT", "播放列表名称已存在")
		} else if strings.Contains(err.Error(), "not found") {
			ErrorResponse(ctx, http.StatusNotFound, "NOT_FOUND", "指定播放列表不存在")
		} else {
			ErrorResponse(ctx, http.StatusInternalServerError, "UPDATE_FAILED", err.Error())
		}
		return
	}

	SuccessResponse(ctx, "playlist", updatedPlaylist, 1)
}

func (c *PlaylistController) DeletePlaylist(ctx *gin.Context) {
	var req struct {
		ID string `form:"id" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ErrorResponse(ctx, http.StatusBadRequest, "MISSING_PARAMETER", "Missing ID parameter")
		return
	}

	success, err := c.PlaylistUsecase.DeletePlaylist(ctx.Request.Context(), req.ID)
	if err != nil || !success {
		ErrorResponse(ctx, http.StatusInternalServerError, "DELETION_FAILED", "Delete failed")
		return
	}
	SuccessResponse(ctx, "result", gin.H{"message": "Deleted successfully"}, 1)
}
