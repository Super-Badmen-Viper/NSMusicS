package controller_app_config

import (
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_config"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
)

type AppServerConfigController struct {
	usecase domain_app_config.AppServerConfigUsecase
}

func NewAppServerConfigController(uc domain_app_config.AppServerConfigUsecase) *AppServerConfigController {
	return &AppServerConfigController{usecase: uc}
}

func (ctrl *AppServerConfigController) Update(c *gin.Context) {
	var req domain_app_config.AppServerConfig
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request format"})
		return
	}

	if req.ID.IsZero() || req.ID == primitive.NilObjectID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required and must be a valid ObjectID"})
		return
	}

	if err := ctrl.usecase.Update(c.Request.Context(), &req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "app config updated"})
}

func (ctrl *AppServerConfigController) GetAll(c *gin.Context) {
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

func (ctrl *AppServerConfigController) Delete(c *gin.Context) {
	idParam := c.Query("id")

	if idParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "必须提供ID参数",
		})
		return
	}

	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "非法的ID格式：" + idParam,
		})
		return
	}

	if err := ctrl.usecase.Delete(c.Request.Context(), id); err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "未找到ID为 " + idParam + " 的配置项",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "删除操作失败：" + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "配置项 " + idParam + " 删除成功",
	})
}
