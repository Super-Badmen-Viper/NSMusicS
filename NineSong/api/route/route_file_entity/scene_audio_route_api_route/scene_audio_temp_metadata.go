package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
	"time"
)

func NewTempRouter(
	env *bootstrap.Env,
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {

}
