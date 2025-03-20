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

func NewAppAudioConfigRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_app.NewAppAudioConfigRepository(db, domain.CollectionAppAudioConfigs)
	uc := usecase_app.NewAppAudioConfigUsecase(repo, timeout)
	ctrl := controller_app.NewAppAudioConfigController(uc)

	group.GET("/app/audio", ctrl.GetAll)
	group.POST("/app/audio", ctrl.Create)
	group.PUT("/app/audio", ctrl.ReplaceAll)
}
