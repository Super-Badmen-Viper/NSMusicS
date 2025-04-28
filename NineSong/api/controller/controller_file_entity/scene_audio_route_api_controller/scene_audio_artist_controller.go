package scene_audio_route_api_controller

import (
	"net/http"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/gin-gonic/gin"
)

type ArtistController struct {
	ArtistUsecase scene_audio_route_interface.ArtistRepository
}

func NewArtistController(uc scene_audio_route_interface.ArtistRepository) *ArtistController {
	return &ArtistController{ArtistUsecase: uc}
}

func (c *ArtistController) GetArtists(ctx *gin.Context) {
	params := struct {
		Start   string `form:"start"`
		End     string `form:"end"`
		Sort    string `form:"sort"`
		Order   string `form:"order"`
		Search  string `form:"search"`
		Starred string `form:"starred"`
	}{
		Start:   ctx.DefaultQuery("start", "0"),
		End:     ctx.DefaultQuery("end", "50"),
		Sort:    ctx.DefaultQuery("sort", "name"),
		Order:   ctx.DefaultQuery("order", "asc"),
		Search:  ctx.Query("search"),
		Starred: ctx.Query("starred"),
	}

	artists, err := c.ArtistUsecase.GetArtistItems(
		ctx.Request.Context(),
		params.End,
		params.Order,
		params.Sort,
		params.Start,
		params.Search,
		params.Starred,
	)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.ArtistListResponse{
		Artists: artists,
		Count:   len(artists),
	})
}
