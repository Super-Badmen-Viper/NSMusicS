package system

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/gin-gonic/gin"
)

type LoginController struct {
	LoginUsecase system.LoginUsecase
	Env          *bootstrap.Env
}

func (lc *LoginController) Login(c *gin.Context) {
	var request system.LoginRequest

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, system.ErrorResponse{Message: err.Error()})
		return
	}

	user, err := lc.LoginUsecase.GetUserByEmail(c, request.Email)
	if err != nil {
		c.JSON(http.StatusNotFound, system.ErrorResponse{Message: "User not found with the given email"})
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)) != nil {
		c.JSON(http.StatusUnauthorized, system.ErrorResponse{Message: "Invalid credentials"})
		return
	}

	accessToken, err := lc.LoginUsecase.CreateAccessToken(&user, lc.Env.AccessTokenSecret, lc.Env.AccessTokenExpiryHour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, system.ErrorResponse{Message: err.Error()})
		return
	}

	refreshToken, err := lc.LoginUsecase.CreateRefreshToken(&user, lc.Env.RefreshTokenSecret, lc.Env.RefreshTokenExpiryHour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, system.ErrorResponse{Message: err.Error()})
		return
	}

	loginResponse := system.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}

	c.JSON(http.StatusOK, loginResponse)
}
