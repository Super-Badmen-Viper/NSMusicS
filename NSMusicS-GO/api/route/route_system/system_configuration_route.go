package route_system

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_system"
	"github.com/gin-gonic/gin"
	"time"
)

func NewSystemConfigurationRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_system.NewSystemConfigurationRepository(env, db, domain_system.CollectionSystemConfiguration)
	uc := usecase_system.NewSystemConfigurationUsecase(repo, timeout)
	ctrl := controller_system.NewSystemConfigurationController(uc)

	group.GET("/config", ctrl.Get)
	group.PUT("/config", ctrl.Update)
}
