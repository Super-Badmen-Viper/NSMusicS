package route_file_entity

import (
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_app/controller_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity"
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
	"net/http"
	"time"
)

func NewFileEntityRouter(timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	fileRepo := repository_file_entity.NewFileRepo(db, domain.CollectionFileEntityFileInfo)
	ffmpegRepo := repository_file_entity.NewFFmpegRepo(db)
	detector := &domain_file_entity.FFmpegDetector{}

	uc := usecase_file_entity.NewFileUsecase(fileRepo, detector, ffmpegRepo)
	ctrl := controller_file_entity.NewFileController(uc)

	// 配置速率限制（每分钟10个请求）
	limiter := rate.NewLimiter(rate.Every(time.Minute), 10)

	group.Use(requestLogger())

	group.POST("/scan", ctrl.ScanDirectory)
	group.GET("/ffmpeg/status", ctrl.GetFFmpegStatus)
	group.POST("/transcode", rateLimitWrapper(limiter), ctrl.Transcode)
	group.GET("/tasks/:task_id", ctrl.GetTaskStatus)
}

func requestLogger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("[%s] %s %s %d\n",
			param.TimeStamp.Format(time.RFC3339),
			param.Method,
			param.Path,
			param.StatusCode,
		)
	})
}

func rateLimitWrapper(limiter *rate.Limiter) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !limiter.Allow() {
			c.AbortWithStatusJSON(http.StatusTooManyRequests,
				gin.H{"error": "请求过于频繁"})
			return
		}
		c.Next()
	}
}
