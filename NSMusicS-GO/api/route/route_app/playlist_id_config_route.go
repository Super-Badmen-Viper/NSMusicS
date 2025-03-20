package route_app

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_app"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_app"
	"github.com/gin-gonic/gin"
	"time"
)

func NewAppPlaylistIDConfigRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_app.NewAppPlaylistIDConfigRepository(db, domain.CollectionAppPlaylistIDConfigs)
	uc := usecase_app.NewAppPlaylistIDConfigUsecase(repo, timeout)
	ctrl := controller_app.NewAppPlaylistIDConfigController(uc)

	group.GET("/app/playlist", ctrl.GetAll)
	group.POST("/app/playlist", ctrl.Create)
	group.PUT("/app/playlist", ctrl.ReplaceAll)
}
