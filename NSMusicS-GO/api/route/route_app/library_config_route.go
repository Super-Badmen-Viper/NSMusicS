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

func NewAppLibraryConfigRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_app.NewAppLibraryConfigRepository(db, domain.CollectionAppLibraryConfigs)
	uc := usecase_app.NewAppLibraryConfigUsecase(repo, timeout)
	ctrl := controller_app.NewAppLibraryConfigController(uc)

	group.GET("/app/library", ctrl.GetAll)
	group.POST("/app/library", ctrl.Create)
	group.PUT("/app/library", ctrl.ReplaceAll)
}
