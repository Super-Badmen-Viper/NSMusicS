package system

import (
	system4 "github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system"
	system3 "github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/system"
	system2 "github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/system"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewTaskRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	tr := system3.NewTaskRepository(db, system.CollectionTask)
	tc := &system4.TaskController{
		TaskUsecase: system2.NewTaskUsecase(tr, timeout),
	}
	group.GET("/task", tc.Fetch)
	group.POST("/task", tc.Create)
}
