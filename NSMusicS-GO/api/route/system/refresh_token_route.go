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

func NewRefreshTokenRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := system3.NewUserRepository(db, system.CollectionUser)
	rtc := &system4.RefreshTokenController{
		RefreshTokenUsecase: system2.NewRefreshTokenUsecase(ur, timeout),
		Env:                 env,
	}
	group.POST("/refresh", rtc.RefreshToken)
}
