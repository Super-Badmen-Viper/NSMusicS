package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/gin-gonic/gin"
	"net/http"
)

type PlaylistController struct {
	PlaylistUsecase scene_audio_route_interface.PlaylistRepository
}

func NewPlaylistController(uc scene_audio_route_interface.PlaylistRepository) *PlaylistController {
	return &PlaylistController{PlaylistUsecase: uc}
}

// 获取所有播放列表
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

// 获取单个播放列表
func (c *PlaylistController) GetPlaylist(ctx *gin.Context) {
	playlistId := ctx.Param("playlistId")
	playlist, err := c.PlaylistUsecase.GetPlaylist(ctx.Request.Context(), playlistId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "playlist not found"})
		return
	}
	ctx.JSON(http.StatusOK, playlist)
}

// 创建播放列表
func (c *PlaylistController) CreatePlaylist(ctx *gin.Context) {
	var req struct {
		Name    string `json:"name" binding:"required"`
		Comment string `json:"comment"`
		Public  bool   `json:"public"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	newPlaylist := scene_audio_route_models.PlaylistMetadata{
		Name:    req.Name,
		Comment: req.Comment,
		Public:  req.Public,
		OwnerID: getCurrentUserID(ctx), // 需要实现用户身份获取逻辑
	}

	created, err := c.PlaylistUsecase.CreatePlaylist(ctx.Request.Context(), newPlaylist)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, created)
}

// 更新播放列表
func (c *PlaylistController) UpdatePlaylist(ctx *gin.Context) {
	playlistId := ctx.Param("playlistId")
	var req struct {
		Name    string `json:"name" binding:"required"`
		Comment string `json:"comment"`
		Public  bool   `json:"public"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	updateData := scene_audio_route_models.PlaylistMetadata{
		Name:    req.Name,
		Comment: req.Comment,
		Public:  req.Public,
	}

	success, err := c.PlaylistUsecase.UpdatePlaylistInfo(ctx.Request.Context(), playlistId, updateData)
	if err != nil || !success {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}
	ctx.Status(http.StatusNoContent)
}

// 删除播放列表
func (c *PlaylistController) DeletePlaylist(ctx *gin.Context) {
	playlistId := ctx.Param("playlistId")
	success, err := c.PlaylistUsecase.DeletePlaylist(ctx.Request.Context(), playlistId)
	if err != nil || !success {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}
	ctx.Status(http.StatusNoContent)
}

// 添加媒体文件
func (c *PlaylistController) AddMediaFiles(ctx *gin.Context) {
	playlistId := ctx.Param("playlistId")
	var req struct {
		MediaFileIDs string `json:"media_file_ids" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	success, err := c.PlaylistUsecase.UpdatePlaylistMediaFileIdToAdd(
		ctx.Request.Context(),
		playlistId,
		req.MediaFileIDs,
	)
	if err != nil || !success {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "add media failed"})
		return
	}
	ctx.Status(http.StatusNoContent)
}

// 移除媒体文件
func (c *PlaylistController) RemoveMediaFiles(ctx *gin.Context) {
	playlistId := ctx.Param("playlistId")
	var req struct {
		MediaFileIDs string `json:"media_file_ids" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	success, err := c.PlaylistUsecase.UpdatePlaylistMediaFileIndexToRemove(
		ctx.Request.Context(),
		playlistId,
		req.MediaFileIDs,
	)
	if err != nil || !success {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "remove media failed"})
		return
	}
	ctx.Status(http.StatusNoContent)
}

// 获取当前用户ID（需根据项目鉴权方案实现）
func getCurrentUserID(ctx *gin.Context) string {
	// 示例实现，需替换为实际鉴权逻辑
	return "user123"
}
