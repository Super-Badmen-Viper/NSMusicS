package controller_app

import (
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AppLibraryConfigController struct {
	usecase domain_app.AppLibraryConfigUsecase
}

func NewAppLibraryConfigController(uc domain_app.AppLibraryConfigUsecase) *AppLibraryConfigController {
	return &AppLibraryConfigController{usecase: uc}
}

func (ctrl *AppLibraryConfigController) ReplaceAll(c *gin.Context) {
	var req []*domain_app.AppLibraryConfig
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request format"})
		return
	}

	if err := ctrl.usecase.ReplaceAll(c.Request.Context(), req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}
	c.Status(http.StatusNoContent)
}

func (ctrl *AppLibraryConfigController) GetAll(c *gin.Context) {
	configs, err := ctrl.usecase.GetAll(c.Request.Context())
	if err != nil {
		if errors.Is(err, domain.ErrEmptyCollection) {
			c.JSON(http.StatusOK, []interface{}{})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
		return
	}
	c.JSON(http.StatusOK, configs)
}
