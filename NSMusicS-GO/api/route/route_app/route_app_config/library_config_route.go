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

func NewAppLibraryConfigRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_app_config.NewAppLibraryConfigRepository(db, domain.CollectionAppLibraryConfigs)
	uc := usecase_app_config.NewAppLibraryConfigUsecase(repo, timeout)
	ctrl := controller_app_config.NewAppLibraryConfigController(uc)

	group.GET("/app/library", ctrl.GetAll)
	group.PUT("/app/library", ctrl.ReplaceAll)
}
