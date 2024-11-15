package controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/basic"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/basic_response"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TaskController struct {
	TaskUsecase basic.TaskUsecase
}

func (tc *TaskController) Create(c *gin.Context) {
	var task basic.Task

	err := c.ShouldBind(&task)
	if err != nil {
		c.JSON(http.StatusBadRequest, basic_response.ErrorResponse{Message: err.Error()})
		return
	}

	userID := c.GetString("x-user-id")
	task.ID = primitive.NewObjectID()

	task.UserID, err = primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, basic_response.ErrorResponse{Message: err.Error()})
		return
	}

	err = tc.TaskUsecase.Create(c, &task)
	if err != nil {
		c.JSON(http.StatusInternalServerError, basic_response.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, basic_response.SuccessResponse{
		Message: "Task created successfully",
	})
}

func (u *TaskController) Fetch(c *gin.Context) {
	userID := c.GetString("x-user-id")

	tasks, err := u.TaskUsecase.FetchByUserID(c, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, basic_response.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, tasks)
}
