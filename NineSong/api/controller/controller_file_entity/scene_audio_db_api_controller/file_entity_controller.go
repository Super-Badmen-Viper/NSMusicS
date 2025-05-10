package scene_audio_db_api_controller

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type FileController struct {
	usecase *usecase_file_entity.FileUsecase
}

func NewFileController(uc *usecase_file_entity.FileUsecase) *FileController {
	return &FileController{usecase: uc}
}

func (ctrl *FileController) ScanDirectory(c *gin.Context) {
	var req struct {
		FolderPath string                          `json:"folder_path" binding:"required"`
		FileTypes  []domain_file_entity.FileTypeNo `json:"file_types" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		scene_audio_route_api_controller.ErrorResponse(c, http.StatusBadRequest, "INVALID_REQUEST", "无效的请求格式")
		return
	}

	bgCtx := context.Background()
	go func() {
		if err := ctrl.usecase.ProcessDirectory(bgCtx, req.FolderPath, req.FileTypes); err != nil {
			log.Printf("Scan failed: %v", err)
		}
	}()

	c.JSON(http.StatusAccepted, gin.H{
		"ninesong-response": gin.H{
			"status":        "ok",
			"version":       scene_audio_route_api_controller.APIVersion,
			"type":          scene_audio_route_api_controller.ServiceType,
			"serverVersion": scene_audio_route_api_controller.ServerVersion,
			"message":       "后台处理已启动",
		},
	})
}
