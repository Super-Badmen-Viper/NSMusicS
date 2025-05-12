package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AlbumController struct {
	AlbumUsecase scene_audio_route_interface.AlbumRepository
}

func NewAlbumController(uc scene_audio_route_interface.AlbumRepository) *AlbumController {
	return &AlbumController{AlbumUsecase: uc}
}

func (c *AlbumController) GetAlbumItems(ctx *gin.Context) {
	params := struct {
		Start    string `form:"start" binding:"required"`
		End      string `form:"end" binding:"required"`
		Sort     string `form:"sort"`
		Order    string `form:"order"`
		Search   string `form:"search"`
		Starred  string `form:"starred"`
		ArtistID string `form:"artist_id"`
		MinYear  string `form:"min_year"`
		MaxYear  string `form:"max_year"`
	}{
		Start:    ctx.Query("start"),
		End:      ctx.Query("end"),
		Sort:     ctx.DefaultQuery("sort", "name"),
		Order:    ctx.DefaultQuery("order", "asc"),
		Search:   ctx.Query("search"),
		Starred:  ctx.Query("starred"),
		ArtistID: ctx.Query("artist_id"),
		MinYear:  ctx.Query("min_year"),
		MaxYear:  ctx.Query("max_year"),
	}

	if params.Start == "" || params.End == "" {
		ErrorResponse(ctx, http.StatusBadRequest, "MISSING_PARAMS", "必须提供start和end参数")
		return
	}

	albums, err := c.AlbumUsecase.GetAlbumItems(
		ctx.Request.Context(),
		params.End,
		params.Order,
		params.Sort,
		params.Start,
		params.Search,
		params.Starred,
		params.ArtistID,
		params.MinYear,
		params.MaxYear,
	)

	if err != nil {
		ErrorResponse(ctx, http.StatusInternalServerError, "SERVER_ERROR", err.Error())
		return
	}

	SuccessResponse(ctx, "albums", albums, len(albums))
}

func (c *AlbumController) GetAlbumFilterCounts(ctx *gin.Context) {
	params := struct {
		Search   string `form:"search"`
		Starred  string `form:"starred"`
		ArtistID string `form:"artist_id"`
		MinYear  string `form:"min_year"`
		MaxYear  string `form:"max_year"`
	}{
		Search:   ctx.Query("search"),
		Starred:  ctx.Query("starred"),
		ArtistID: ctx.Query("artist_id"),
		MinYear:  ctx.Query("min_year"),
		MaxYear:  ctx.Query("max_year"),
	}

	counts, err := c.AlbumUsecase.GetAlbumFilterItemsCount(
		ctx.Request.Context(),
		params.Search,
		params.Starred,
		params.ArtistID,
		params.MinYear,
		params.MaxYear,
	)

	if err != nil {
		ErrorResponse(ctx, http.StatusInternalServerError, "SERVER_ERROR", err.Error())
		return
	}

	SuccessResponse(ctx, "albums", counts, 1)
}
