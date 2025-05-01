package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity/scene_audio/scene_audio_route_repository"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity/scene_audio/scene_audio_route_usecase"
	"github.com/gin-gonic/gin"
	"time"
)

func NewPlaylistTrackRouter(
	env *bootstrap.Env,
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewPlaylistTrackRepository(db, domain.CollectionFileEntityAudioPlaylistTrack)
	uc := scene_audio_route_usecase.NewPlaylistTrackUsecase(repo, timeout)
	ctrl := scene_audio_route_api_controller.NewPlaylistTrackController(uc)

	playlistTrackGroup := group.Group("/playlists/tracks")
	{
		// 获取曲目列表
		playlistTrackGroup.GET("", ctrl.GetPlaylistTracks)
		// 添加曲目
		playlistTrackGroup.POST("/add", ctrl.AddPlaylistTracks)
		// 移除曲目
		playlistTrackGroup.POST("/remove", ctrl.RemovePlaylistTracks)
		// 排序曲目
		playlistTrackGroup.PUT("/sort", ctrl.SortPlaylistTracks)
	}
}
