package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity/scene_audio/scene_audio_route_repository"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewArtistRouter(
	env *bootstrap.Env,
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewArtistRepository(db, domain.CollectionFileEntityAudioArtist)

	ctrl := scene_audio_route_api_controller.NewArtistController(repo)

	artistGroup := group.Group("/artists")
	{
		artistGroup.GET("", ctrl.GetArtists)
	}
}
