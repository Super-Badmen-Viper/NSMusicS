package scene_audio_route_api_controller

import "github.com/gin-gonic/gin"

const (
	APIVersion    = "1.0.0"
	ServerVersion = "1.0.0"
	ServiceType   = "NSMusicS"
)

func SuccessResponse(c *gin.Context, dataKey string, data interface{}, count int) {
	c.JSON(200, gin.H{
		"ninesong-response": gin.H{
			"status":        "ok",
			"version":       APIVersion,
			"type":          ServiceType,
			"serverVersion": ServerVersion,
			dataKey:         data,
			"count":         count,
		},
	})
}

func ErrorResponse(c *gin.Context, statusCode int, errorCode string, message string) {
	c.JSON(statusCode, gin.H{
		"ninesong-response": gin.H{
			"status":        "error",
			"version":       APIVersion,
			"type":          ServiceType,
			"serverVersion": ServerVersion,
			"error": gin.H{
				"code":    errorCode,
				"message": message,
			},
		},
	})
}
