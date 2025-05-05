package route_auth

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_auth"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewTaskRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	tr := repository_auth.NewTaskRepository(db, domain.CollectionTask)
	tc := &controller_auth.TaskController{
		TaskUsecase: usecase_auth.NewTaskUsecase(tr, timeout),
	}
	group.GET("/user/task", tc.Fetch)
	group.POST("/user/task", tc.Create)
}
