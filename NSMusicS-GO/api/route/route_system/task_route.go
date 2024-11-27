package route_system

import (
	system4 "github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	system3 "github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_system"
	system2 "github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_system"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewTaskRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	tr := system3.NewTaskRepository(db, domain_system.CollectionTask)
	tc := &system4.TaskController{
		TaskUsecase: system2.NewTaskUsecase(tr, timeout),
	}
	group.GET("/task", tc.Fetch)
	group.POST("/task", tc.Create)
}
