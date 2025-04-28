package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity/scene_audio/scene_audio_route_repository"
	"github.com/gin-gonic/gin"
	"time"
)

func NewAnnotationRouter(
	env *bootstrap.Env,
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewAnnotationRepository(db)
	ctrl := scene_audio_route_api_controller.NewAnnotationController(repo)

	annotationGroup := group.Group("/annotations")
	{
		annotationGroup.GET("/artists", ctrl.GetArtistList)       // 艺术家标注数据
		annotationGroup.GET("/albums", ctrl.GetAlbumList)         // 专辑标注数据
		annotationGroup.GET("/mediafiles", ctrl.GetMediaFileList) // 媒体文件标注数据
	}
}
