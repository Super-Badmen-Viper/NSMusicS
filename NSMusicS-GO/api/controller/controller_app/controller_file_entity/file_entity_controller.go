package controller_file_entity

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
)

type FileController struct {
	usecase *usecase_file_entity.FileUsecase
}

func NewFileController(uc *usecase_file_entity.FileUsecase) *FileController {
	return &FileController{usecase: uc}
}

func errorResponse(c *gin.Context, code int, message string) {
	c.AbortWithStatusJSON(code, gin.H{"error": message})
}

func (ctrl *FileController) ScanDirectory(c *gin.Context) {
	var req struct {
		FolderPath string                        `json:"folder_path" binding:"required"`
		FileTypes  []domain_file_entity.FileType `json:"file_types" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		errorResponse(c, http.StatusBadRequest, "无效请求格式")
		return
	}

	go func() {
		if err := ctrl.usecase.ProcessDirectory(c.Request.Context(), req.FolderPath, req.FileTypes); err != nil {
			// 记录错误日志
		}
	}()

	c.JSON(http.StatusAccepted, gin.H{"status": "scan_started"})
}

func (ctrl *FileController) GetFFmpegStatus(c *gin.Context) {
	running, version := ctrl.usecase.Ffmpeg.GetStatus()
	c.JSON(http.StatusOK, gin.H{
		"running": running,
		"version": version,
	})
}

func (ctrl *FileController) Transcode(c *gin.Context) {
	var req struct {
		Input  string `json:"input_path" binding:"required"`
		Output string `json:"output_path" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		errorResponse(c, http.StatusBadRequest, "无效请求格式")
		return
	}

	taskID, err := ctrl.usecase.Ffmpeg.CreateTask(req.Input, req.Output)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "转码任务创建失败")
		return
	}

	c.JSON(http.StatusAccepted, gin.H{
		"task_id": taskID.Hex(),
		"status":  "queued",
	})
}

func (ctrl *FileController) GetTaskStatus(c *gin.Context) {
	taskID, err := primitive.ObjectIDFromHex(c.Param("task_id"))
	if err != nil {
		errorResponse(c, http.StatusBadRequest, "无效任务ID")
		return
	}

	task, err := ctrl.usecase.Ffmpeg.GetTask(taskID)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "获取任务状态失败")
		return
	}

	c.JSON(http.StatusOK, task)
}
