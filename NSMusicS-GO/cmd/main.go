package main

import (
	route "github.com/amitshekhariitbhu/go-backend-clean-architecture/api/route/system"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/gin-gonic/gin"
)

func main() {
	app := bootstrap.App()
	env := app.Env

	db := app.Mongo.Database(env.DBName)
	defer app.CloseDBConnection()

	gin := gin.Default()
	timeout := time.Duration(env.ContextTimeout) * time.Second
	route.Setup(env, timeout, db, gin)

	gin.Run(env.ServerAddress)
}
