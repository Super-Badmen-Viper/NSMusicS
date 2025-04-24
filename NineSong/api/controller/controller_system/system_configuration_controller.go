package controller_system

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	"github.com/gin-gonic/gin"
	"net/http"
)

type SystemConfigurationController struct {
	usecase domain_system.SystemConfigurationUsecase
}

func NewSystemConfigurationController(uc domain_system.SystemConfigurationUsecase) *SystemConfigurationController {
	return &SystemConfigurationController{usecase: uc}
}

func (c *SystemConfigurationController) Get(ctx *gin.Context) {
	info, err := c.usecase.Get(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, info)
}

func (c *SystemConfigurationController) Update(ctx *gin.Context) {
	var req domain_system.SystemConfiguration
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.usecase.Update(ctx, &req); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "system info updated"})
}
