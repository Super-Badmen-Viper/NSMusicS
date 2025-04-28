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

func NewPlaylistRouter(
	env *bootstrap.Env,
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewPlaylistRepository(db, domain.CollectionFileEntityAudioPlaylist)
	ctrl := scene_audio_route_api_controller.NewPlaylistController(repo)

	playlistGroup := group.Group("/playlists")
	{
		playlistGroup.GET("", ctrl.GetPlaylists)
		playlistGroup.POST("", ctrl.CreatePlaylist)
		playlistGroup.GET("/detail", ctrl.GetPlaylist)
		playlistGroup.PUT("", ctrl.UpdatePlaylist)
		playlistGroup.DELETE("", ctrl.DeletePlaylist)
		playlistGroup.POST("/media", ctrl.AddMediaFiles)
		playlistGroup.DELETE("/media", ctrl.RemoveMediaFiles)
	}
}
