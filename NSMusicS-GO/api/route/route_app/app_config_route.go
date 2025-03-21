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

func NewAppConfigRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_app.NewAppConfigRepository(db, domain.CollectionAppConfigs)
	uc := usecase_app.NewAppConfigUsecase(repo, timeout)
	ctrl := controller_app.NewAppConfigController(uc)

	group.GET("/app/config", ctrl.GetAll)
	group.PUT("/app/config", ctrl.ReplaceAll)
}
