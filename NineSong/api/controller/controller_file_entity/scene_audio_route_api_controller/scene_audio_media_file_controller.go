package scene_audio_route_api_controller

import (
	"net/http"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
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
		Start    string `form:"start"`
		End      string `form:"end"`
		Sort     string `form:"sort"`
		Order    string `form:"order"`
		Search   string `form:"search"`
		Starred  string `form:"starred"`
		AlbumID  string `form:"album_id"`
		ArtistID string `form:"artist_id"`
		Year     string `form:"year"`
	}{
		Start:    ctx.DefaultQuery("start", "0"),
		End:      ctx.DefaultQuery("end", "100"),
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
		handleMediaFileError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.MediaFileListResponse{
		MediaFiles: mediaFiles,
		Count:      len(mediaFiles),
	})
}

func handleMediaFileError(ctx *gin.Context, err error) {
	switch err.Error() {
	case "invalid start parameter",
		"invalid end parameter",
		"invalid starred parameter",
		"invalid album id format",
		"invalid artist id format",
		"year must be integer":
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	default:
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "服务器内部错误"})
	}
}
