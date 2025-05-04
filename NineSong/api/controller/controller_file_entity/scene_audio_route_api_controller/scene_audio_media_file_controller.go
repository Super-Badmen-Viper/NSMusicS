package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/gin-gonic/gin"
	"net/http"
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
	if params.Start == "" || params.End == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    "MISSING_PARAMS",
			"message": "必须提供start和end参数",
		})
		return
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
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code":    "SERVER_ERROR",
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.MediaFileListResponse{
		MediaFiles: mediaFiles,
		Count:      len(mediaFiles),
	})
}
