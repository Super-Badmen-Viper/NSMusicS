package scene_audio_route_api_controller

import (
	"net/http"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/gin-gonic/gin"
)

type MediaFileController struct {
	MediaFileUsecase scene_audio_route_interface.MediaFileRepository
}

func NewMediaFileController(uc scene_audio_route_interface.MediaFileRepository) *MediaFileController {
	return &MediaFileController{MediaFileUsecase: uc}
}

func (c *MediaFileController) GetMediaFiles(ctx *gin.Context) {
	params := struct {
		Start    string `form:"start" binding:"required"`
		End      string `form:"end" binding:"required"`
		Sort     string `form:"sort"`
		Order    string `form:"order"`
		Search   string `form:"search"`
		Starred  string `form:"starred"`
		AlbumID  string `form:"album_id"`
		ArtistID string `form:"artist_id"`
		Year     string `form:"year"`
	}{
		Start:    ctx.Query("start"),
		End:      ctx.Query("end"),
		Sort:     ctx.DefaultQuery("sort", "title"),
		Order:    ctx.DefaultQuery("order", "asc"),
		Search:   ctx.Query("search"),
		Starred:  ctx.Query("starred"),
		AlbumID:  ctx.Query("album_id"),
		ArtistID: ctx.Query("artist_id"),
		Year:     ctx.Query("year"),
	}

	mediaFiles, err := c.MediaFileUsecase.GetMediaFileItems(
		ctx.Request.Context(),
		params.End,
		params.Order,
		params.Sort,
		params.Start,
		params.Search,
		params.Starred,
		params.AlbumID,
		params.ArtistID,
		params.Year,
	)

	if err != nil {
		ErrorResponse(ctx, http.StatusInternalServerError, "SERVER_ERROR", err.Error())
		return
	}

	SuccessResponse(ctx, "mediaFiles", mediaFiles, len(mediaFiles))
}

func (c *MediaFileController) GetMediaFilterCounts(ctx *gin.Context) {
	params := struct {
		Search   string `form:"search"`
		Starred  string `form:"starred"`
		AlbumID  string `form:"album_id"`
		ArtistID string `form:"artist_id"`
		Year     string `form:"year"`
	}{
		Search:   ctx.Query("search"),
		Starred:  ctx.Query("starred"),
		AlbumID:  ctx.Query("album_id"),
		ArtistID: ctx.Query("artist_id"),
		Year:     ctx.Query("year"),
	}

	counts, err := c.MediaFileUsecase.GetMediaFileFilterItemsCount(
		ctx.Request.Context(),
		params.Search,
		params.Starred,
		params.AlbumID,
		params.ArtistID,
		params.Year,
	)

	if err != nil {
		ErrorResponse(ctx, http.StatusInternalServerError, "SERVER_ERROR", err.Error())
		return
	}

	SuccessResponse(ctx, "mediaFiles", counts, 1)
}
