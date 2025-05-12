package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity/scene_audio/scene_audio_route_repository"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity/scene_audio/scene_audio_route_usecase"
	"github.com/gin-gonic/gin"
	"time"
)

func NewPlaylistRouter(
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewPlaylistRepository(db, domain.CollectionFileEntityAudioPlaylist)
	usecase := scene_audio_route_usecase.NewPlaylistUsecase(repo, timeout)
	ctrl := scene_audio_route_api_controller.NewPlaylistController(usecase)

	playlistGroup := group.Group("/playlists")
	{
		playlistGroup.GET("", ctrl.GetPlaylists)
		playlistGroup.POST("", ctrl.CreatePlaylist)
		playlistGroup.GET("/detail", ctrl.GetPlaylist)
		playlistGroup.PUT("", ctrl.UpdatePlaylist)
		playlistGroup.DELETE("", ctrl.DeletePlaylist)
	}
}
