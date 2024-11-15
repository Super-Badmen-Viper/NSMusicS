package controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/basic"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/basic_response"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProfileController struct {
	ProfileUsecase basic.ProfileUsecase
}

func (pc *ProfileController) Fetch(c *gin.Context) {
	userID := c.GetString("x-user-id")

	profile, err := pc.ProfileUsecase.GetProfileByID(c, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, basic_response.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}
