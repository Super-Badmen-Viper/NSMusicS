package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity/scene_audio/scene_audio_route_repository"
	"github.com/gin-gonic/gin"
	"time"
)

func NewPlaylistTrackRouter(
	env *bootstrap.Env,
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewPlaylistTrackRepository(db, domain.CollectionFileEntityPlaylistTrack)

	ctrl := scene_audio_route_api_controller.NewPlaylistTrackController(repo)

	playlistTrackGroup := group.Group("/playlists/:playlistId/tracks")
	{
		playlistTrackGroup.GET("", ctrl.GetPlaylistTracks)
	}
}
