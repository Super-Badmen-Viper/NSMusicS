package controller_file_entity

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

	bgCtx := context.Background()
	go func() {
		// 基础扫描流程
		if err := ctrl.usecase.ProcessDirectory(bgCtx, req.FolderPath, req.FileTypes); err != nil {
			log.Printf("Scan failed: %v", err)
			return
		}
		log.Println("基础元数据扫描完毕")
		for _, fileType := range req.FileTypes { // 修复变量名错误
			switch fileType {
			case domain_file_entity.Audio:
				go ctrl.processAudioMetadata(bgCtx) // 占位参数
			case domain_file_entity.Video:
				go ctrl.processVideoMetadata(bgCtx) // 占位参数
			default:
				log.Printf("Unhandled file type: %d", fileType)
			}
		}
		log.Println("场景元数据扫描完毕")
	}()

	c.JSON(http.StatusAccepted, gin.H{
		"status":  "scan_started",
		"message": "background processing initiated",
	})
}

// 音频元数据存储示例
func (ctrl *FileController) processAudioMetadata(ctx context.Context) {
	// 音频专用处理逻辑...
}

// 视频元数据存储示例
func (ctrl *FileController) processVideoMetadata(ctx context.Context) {
	// 视频专用处理逻辑...
}
