package scene_audio_db_api_controller

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
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
		FolderPath string                        `json:"folder_path" binding:"required"`
		FileTypes  []domain_file_entity.FileType `json:"file_types" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "invalid request format",
		})
		return
	}

	// 创建独立上下文，不使用清洁架构自带的上下文(使用将无法完成后台任务而直接返回error)
	bgCtx := context.Background()
	go func() {
		if err := ctrl.usecase.ProcessDirectory(bgCtx, req.FolderPath, req.FileTypes); err != nil {
			log.Printf("Scan failed: %v", err)
			return
		}
	}()

	c.JSON(http.StatusAccepted, gin.H{
		"status":  "scan_started",
		"message": "background processing initiated",
	})
}
