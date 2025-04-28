package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/gin-gonic/gin"
	"net/http"
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
		PlaylistId string `form:"playlistId" binding:"required"` // 改为表单参数
	}

	// 参数绑定与验证（参考网页6、网页7）
	if err := ctx.ShouldBind(&params); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "INVALID_PARAMETERS",
			"message": "缺少必要参数",
			"details": err.Error(),
		})
		return
	}

	// 业务逻辑保持不变
	tracks, err := c.PlaylistTrackUsecase.GetPlaylistTrackItems(
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
			"code":    "DATA_RETRIEVAL_ERROR",
			"message": "获取播放列表曲目失败",
		})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.PlaylistTrackListResponse{
		PlaylistTracks: tracks,
		Count:          len(tracks),
	})
}
