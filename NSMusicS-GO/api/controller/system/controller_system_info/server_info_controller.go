package controller_system_info

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system/domain_system_info"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ServerInfoController struct {
	usecase domain_system_info.ServerInfoUsecase
}

func NewServerInfoController(uc domain_system_info.ServerInfoUsecase) *ServerInfoController {
	return &ServerInfoController{usecase: uc}
}

// GetServerInfo 获取信息接口
func (c *ServerInfoController) GetServerInfo(ctx *gin.Context) {
	info, err := c.usecase.Get(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, info)
}

// UpdateServerInfo 更新信息接口
func (c *ServerInfoController) UpdateServerInfo(ctx *gin.Context) {
	var req domain_system_info.ServerInfo
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.usecase.Update(ctx, &req); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "server info updated"})
}
