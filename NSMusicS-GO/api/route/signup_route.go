package route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system"
	system3 "github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/system"
	system2 "github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/system"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewSignupRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := system3.NewUserRepository(db, system.CollectionUser)
	sc := controller.SignupController{
		SignupUsecase: system2.NewSignupUsecase(ur, timeout),
		Env:           env,
	}
	group.POST("/signup", sc.Signup)
}
