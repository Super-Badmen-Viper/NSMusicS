package route_system_info

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/system/controller_system_info"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system/domain_system_info"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/system/repository_system_info"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/system/usecase_system_info"
	"github.com/gin-gonic/gin"
	"time"
)

func NewServerInfoRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_system_info.NewServerInfoRepository(env, db, domain_system_info.CollectionServerInfo)
	uc := usecase_system_info.NewServerInfoUsecase(repo, timeout)
	ctrl := controller_system_info.NewServerInfoController(uc)

	group.GET("/info", ctrl.GetServerInfo)
	group.PUT("/info", ctrl.UpdateServerInfo)
}
