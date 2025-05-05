package route_auth

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_auth"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewProfileRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := repository_auth.NewUserRepository(db, domain.CollectionUser)
	pc := &controller_auth.ProfileController{
		ProfileUsecase: usecase_auth.NewProfileUsecase(ur, timeout),
	}
	group.GET("/user/profile", pc.Fetch)
}
