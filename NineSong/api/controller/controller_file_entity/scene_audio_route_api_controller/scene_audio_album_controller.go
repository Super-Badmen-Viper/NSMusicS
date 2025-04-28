package scene_audio_route_api_controller

import (
	"net/http"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/gin-gonic/gin"
)

type AlbumController struct {
	AlbumUsecase scene_audio_route_interface.AlbumRepository
}

func NewAlbumController(uc scene_audio_route_interface.AlbumRepository) *AlbumController {
	return &AlbumController{AlbumUsecase: uc}
}

func (ac *AlbumController) GetAlbumItems(c *gin.Context) {
	params := struct {
		Start    string `form:"start"`
		End      string `form:"end"`
		Sort     string `form:"sort"`
		Order    string `form:"order"`
		Search   string `form:"search"`
		Starred  string `form:"starred"`
		ArtistID string `form:"artist_id"`
	}{
		Start:    c.DefaultQuery("start", "0"),
		End:      c.DefaultQuery("end", "50"),
		Sort:     c.DefaultQuery("sort", "name"),
		Order:    c.DefaultQuery("order", "asc"),
		Search:   c.Query("search"),
		Starred:  c.Query("starred"),
		ArtistID: c.Query("artist_id"),
	}

	albums, err := ac.AlbumUsecase.GetAlbumItems(
		c.Request.Context(),
		params.End,
		params.Order,
		params.Sort,
		params.Start,
		params.Search,
		params.Starred,
		params.ArtistID,
	)

	if err != nil {
		handleAlbumError(c, err)
		return
	}

	c.JSON(http.StatusOK, scene_audio_route_models.AlbumListResponse{
		Albums: albums,
		Count:  len(albums),
	})
}

func handleAlbumError(c *gin.Context, err error) {
	switch err.Error() {
	case "invalid start parameter",
		"invalid end parameter",
		"invalid starred parameter",
		"invalid artist id format":
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "服务器内部错误"})
	}
}
