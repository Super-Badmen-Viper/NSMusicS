package route_system_auth

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/system/controller_system_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system/domain_system_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/system/repository_system_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/system/usecase_system_auth"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewTaskRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	tr := repository_system_auth.NewTaskRepository(db, domain_system_auth.CollectionTask)
	tc := &controller_system_auth.TaskController{
		TaskUsecase: usecase_system_auth.NewTaskUsecase(tr, timeout),
	}
	group.GET("/task", tc.Fetch)
	group.POST("/task", tc.Create)
}
