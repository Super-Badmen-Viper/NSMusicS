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

func NewRefreshTokenRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := system3.NewUserRepository(db, domain_system.CollectionUser)
	rtc := &system4.RefreshTokenController{
		RefreshTokenUsecase: system2.NewRefreshTokenUsecase(ur, timeout),
		Env:                 env,
	}
	group.POST("/refresh", rtc.RefreshToken)
}
