package route_app_config

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_app/controller_app_config"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app/repository_app_config"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_app/usecase_app_config"
	"github.com/gin-gonic/gin"
	"time"
)

func NewAppServerConfigRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_app_config.NewAppServerConfigRepository(db, domain.CollectionAppServerConfigs)
	uc := usecase_app_config.NewAppServerConfigUsecase(repo, timeout)
	ctrl := controller_app_config.NewAppServerConfigController(uc)

	group.GET("/app/server", ctrl.GetAll)
	group.PUT("/app/server", ctrl.Update)
	group.DELETE("/app/server", ctrl.Delete)
}
