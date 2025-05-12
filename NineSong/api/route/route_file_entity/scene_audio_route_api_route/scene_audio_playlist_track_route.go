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

func NewPlaylistTrackRouter(
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewPlaylistTrackRepository(db, domain.CollectionFileEntityAudioPlaylistTrack)
	usecase := scene_audio_route_usecase.NewPlaylistTrackUsecase(repo, timeout)
	ctrl := scene_audio_route_api_controller.NewPlaylistTrackController(usecase)

	playlistTrackGroup := group.Group("/playlists/tracks")
	{
		playlistTrackGroup.GET("", ctrl.GetPlaylistTracks)
		playlistTrackGroup.GET("/filter_counts", ctrl.GetPlaylistFilterCounts)
		playlistTrackGroup.POST("/add", ctrl.AddPlaylistTracks)
		playlistTrackGroup.POST("/remove", ctrl.RemovePlaylistTracks)
		playlistTrackGroup.PUT("/sort", ctrl.SortPlaylistTracks)
	}
}
