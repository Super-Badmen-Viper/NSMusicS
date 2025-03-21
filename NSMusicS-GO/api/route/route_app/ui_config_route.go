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

func NewAppUIConfigRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_app.NewAppUIConfigRepository(db, domain.CollectionAppUIConfigs)
	uc := usecase_app.NewAppUIConfigUsecase(repo, timeout)
	ctrl := controller_app.NewAppUIConfigController(uc)

	group.GET("/app/ui", ctrl.GetAll)
	group.PUT("/app/ui", ctrl.ReplaceAll)
}
