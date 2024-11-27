package route_system

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	system3 "github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_system"
	system2 "github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_system"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewLoginRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := system3.NewUserRepository(db, domain_system.CollectionUser)
	lc := &controller.LoginController{
		LoginUsecase: system2.NewLoginUsecase(ur, timeout),
		Env:          env,
	}
	group.POST("/login", lc.Login)
}
