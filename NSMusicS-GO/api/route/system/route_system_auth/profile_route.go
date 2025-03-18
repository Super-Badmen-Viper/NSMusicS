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

func NewProfileRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := repository_system_auth.NewUserRepository(db, domain_system_auth.CollectionUser)
	pc := &controller_system_auth.ProfileController{
		ProfileUsecase: usecase_system_auth.NewProfileUsecase(ur, timeout),
	}
	group.GET("/profile", pc.Fetch)
}
