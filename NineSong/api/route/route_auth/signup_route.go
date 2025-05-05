package route_auth

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_auth"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewSignupRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := repository_auth.NewUserRepository(db, domain.CollectionUser)
	sc := controller_auth.SignupController{
		SignupUsecase: usecase_auth.NewSignupUsecase(ur, timeout),
		Env:           env,
	}
	group.POST("/user/signup", sc.Signup)
}
