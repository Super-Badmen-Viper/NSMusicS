package route_app_library

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_app/controller_app_library"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app/repository_app_library"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_app/usecase_app_library"
	"github.com/gin-gonic/gin"
	"time"
)

func NewAppMediaFileLibraryRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	repo := repository_app_library.NewAppMediaFileLibraryRepository(db, domain.CollectionAppMediaFileLibrarys)
	uc := usecase_app_library.NewAppMediaFileLibraryUsecase(repo, timeout)
	ctrl := controller_app_library.NewAppMediaFileLibraryController(uc)

	group.GET("/app/media", ctrl.GetAll)
	group.PUT("/app/media", ctrl.ReplaceAll)
}
