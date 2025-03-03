package route_system

import (
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/middleware/middleware_system"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func Setup(env *bootstrap.Env, timeout time.Duration, db mongo.Database, gin *gin.Engine) {
	// All Public APIs
	publicRouter := gin.Group("")
	RouterPublic(env, timeout, db, publicRouter)

	// All Private APIs
	protectedRouter := gin.Group("")
	// Middleware to verify AccessToken
	protectedRouter.Use(middleware_system.JwtAuthMiddleware(env.AccessTokenSecret))
	RouterPrivate(env, timeout, db, protectedRouter)
}

func RouterPublic(env *bootstrap.Env, timeout time.Duration, db mongo.Database, publicRouter *gin.RouterGroup) {
	NewSignupRouter(env, timeout, db, publicRouter)
	NewLoginRouter(env, timeout, db, publicRouter)
	NewRefreshTokenRouter(env, timeout, db, publicRouter)
}

func RouterPrivate(env *bootstrap.Env, timeout time.Duration, db mongo.Database, protectedRouter *gin.RouterGroup) {
	NewProfileRouter(env, timeout, db, protectedRouter)
	NewTaskRouter(env, timeout, db, protectedRouter)
}
