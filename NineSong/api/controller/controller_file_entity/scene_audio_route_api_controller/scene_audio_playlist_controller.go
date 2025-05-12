package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, scene_audio_route_models.PlaylistListResponse{
		Playlists: playlists,
		Count:     len(playlists),
	})
}

func (c *PlaylistController) GetPlaylist(ctx *gin.Context) {
	var req struct {
		ID string `form:"id" binding:"required"`
	}

	if err := ctx.ShouldBindWith(&req, binding.Form); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Missing ID parameter"})
		return
	}

	playlist, err := c.PlaylistUsecase.GetPlaylist(ctx.Request.Context(), req.ID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "playlist not found"})
		return
	}
	ctx.JSON(http.StatusOK, playlist)
}

func (c *PlaylistController) CreatePlaylist(ctx *gin.Context) {
	var req struct {
		Name    string `form:"name" binding:"required"`
		Comment string `form:"comment"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
			"type":  "FORM_BIND_ERROR",
		})
		return
	}

	newPlaylist := scene_audio_route_models.PlaylistMetadata{
		Name:    req.Name,
		Comment: req.Comment,
	}

	created, err := c.PlaylistUsecase.CreatePlaylist(ctx.Request.Context(), newPlaylist)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, created)
}

func (c *PlaylistController) UpdatePlaylist(ctx *gin.Context) {
	var req struct {
		ID      string `form:"id" binding:"required"`
		Name    string `form:"name" binding:"required"`
		Comment string `form:"comment"`
	}

	if err := ctx.ShouldBindWith(&req, binding.Form); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMS",
			"details": err.Error(),
		})
		return
	}

	userid, _ := primitive.ObjectIDFromHex(req.ID)
	updateData := scene_audio_route_models.PlaylistMetadata{
		ID:      userid,
		Name:    req.Name,
		Comment: req.Comment,
	}

	updatedPlaylist, err := c.PlaylistUsecase.UpdatePlaylistInfo(ctx.Request.Context(), req.ID, updateData)
	if err != nil {
		if strings.Contains(err.Error(), "already exists") {
			ctx.JSON(http.StatusConflict, gin.H{
				"code":    "NAME_CONFLICT",
				"message": "播放列表名称已存在",
			})
		} else if strings.Contains(err.Error(), "not found") {
			ctx.JSON(http.StatusNotFound, gin.H{
				"code": "NOT_FOUND",
				"msg":  "指定播放列表不存在",
			})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"code":    "SERVER_ERROR",
				"message": err.Error(),
			})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": "SUCCESS",
		"data": updatedPlaylist,
	})
}

func (c *PlaylistController) DeletePlaylist(ctx *gin.Context) {
	var req struct {
		ID string `form:"id" binding:"required"`
	}

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Missing ID parameter"})
		return
	}

	success, err := c.PlaylistUsecase.DeletePlaylist(ctx.Request.Context(), req.ID)
	if err != nil || !success {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}
	ctx.Status(http.StatusNoContent)
}
