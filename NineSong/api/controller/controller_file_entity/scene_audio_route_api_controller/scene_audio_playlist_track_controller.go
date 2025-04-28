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
	params := struct {
		Start      string `form:"start"`
		End        string `form:"end"`
		Sort       string `form:"sort"`
		Order      string `form:"order"`
		Search     string `form:"search"`
		Starred    string `form:"starred"`
		AlbumId    string `form:"albumId"`
		ArtistId   string `form:"artistId"`
		Year       string `form:"year"`
		PlaylistId string `form:"playlistId"`
	}{
		Start:      ctx.DefaultQuery("start", "0"),
		End:        ctx.DefaultQuery("end", "50"),
		Sort:       ctx.DefaultQuery("sort", "created_at"),
		Order:      ctx.DefaultQuery("order", "asc"),
		Search:     ctx.Query("search"),
		Starred:    ctx.Query("starred"),
		AlbumId:    ctx.Query("albumId"),
		ArtistId:   ctx.Query("artistId"),
		Year:       ctx.Query("year"),
		PlaylistId: ctx.Param("playlistId"),
	}

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
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.PlaylistTrackListResponse{
		PlaylistTracks: tracks,
		Count:          len(tracks),
	})
}
