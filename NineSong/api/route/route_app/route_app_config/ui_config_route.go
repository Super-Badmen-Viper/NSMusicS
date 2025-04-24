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

func NewAppUIConfigRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_app_config.NewAppUIConfigRepository(db, domain.CollectionAppUIConfigs)
	uc := usecase_app_config.NewAppUIConfigUsecase(repo, timeout)
	ctrl := controller_app_config.NewAppUIConfigController(uc)

	group.GET("/app/ui", ctrl.GetAll)
	group.PUT("/app/ui", ctrl.ReplaceAll)
}
