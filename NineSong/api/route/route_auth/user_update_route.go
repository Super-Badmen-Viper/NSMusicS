package route_auth

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_auth"
	"github.com/gin-gonic/gin"
	"time"
)

func NewUpdateUserRouter(
	env *bootstrap.Env,
	timeout time.Duration,
	db mongo.Database,
	router *gin.RouterGroup,
) {
	userRepo := repository_auth.NewUserRepository(db, domain.CollectionUser)
	updateRepo := repository_auth.NewUpdateUserRepository(db, domain.CollectionUser)

	updateUsecase := usecase_auth.NewUpdateUsecase(
		userRepo,
		updateRepo,
		timeout,
	)

	updateController := controller_auth.NewUpdateController(updateUsecase)

	authGroup := router.Group("/user")
	{
		authGroup.POST("/username", updateController.UpdateUsername)
		authGroup.POST("/email", updateController.UpdateEmail)
		authGroup.POST("/password", updateController.UpdatePassword)
	}
}
