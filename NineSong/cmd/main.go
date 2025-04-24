package main

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/route"
	"log"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/gin-gonic/gin"
)

func main() {
	app := bootstrap.App()
	env := app.Env
	db := app.Mongo.Database(env.DBName)
	defer app.CloseDBConnection()

	initializer := bootstrap.NewInitializer(env, db)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := initializer.CheckAndInitialize(ctx); err != nil {
		log.Fatal(err)
	}

	router := gin.Default()
	route.Setup(env, time.Duration(env.ContextTimeout)*time.Second, db, router)
	if err := router.Run(env.ServerAddress); err != nil {
		log.Fatal(err)
	}
}
