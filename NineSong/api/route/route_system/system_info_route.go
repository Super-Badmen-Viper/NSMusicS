package route_system

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_system"
	"github.com/gin-gonic/gin"
	"time"
)

func NewSystemInfoRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_system.NewSystemInfoRepository(db, domain.CollectionSystemInfo)
	uc := usecase_system.NewSystemInfoUsecase(repo, timeout)
	ctrl := controller_system.NewSystemInfoController(uc)

	group.GET("/system/info", ctrl.Get)
	group.PUT("/system/info", ctrl.Update)
}
