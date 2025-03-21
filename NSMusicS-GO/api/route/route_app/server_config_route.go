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

func NewAppServerConfigRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_app.NewAppServerConfigRepository(db, domain.CollectionAppServerConfigs)
	uc := usecase_app.NewAppServerConfigUsecase(repo, timeout)
	ctrl := controller_app.NewAppServerConfigController(uc)

	group.GET("/app/server", ctrl.GetAll)
	group.PUT("/app/server", ctrl.Update)
}
