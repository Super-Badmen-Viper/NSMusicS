package middleware_system

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/internal/internal_system/token_util"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func JwtAuthMiddleware(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 优先从URL参数获取access_token
		authToken := c.Query("access_token")

		// 如果URL参数没有，尝试从Header获取
		if authToken == "" {
			authHeader := c.GetHeader("Authorization")
			if authHeader == "" {
				c.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: "Not authorized"})
				c.Abort()
				return
			}

			// 解析Bearer Token
			tokenParts := strings.Split(authHeader, " ")
			if len(tokenParts) != 2 || strings.ToLower(tokenParts[0]) != "bearer" {
				c.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: "Invalid authorization format"})
				c.Abort()
				return
			}
			authToken = tokenParts[1]
		}

		// 验证令牌
		authorized, err := token_util.IsAuthorized(authToken, secret)
		if !authorized || err != nil {
			c.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: "Invalid token"})
			c.Abort()
			return
		}

		// 提取用户信息
		userID, err := token_util.ExtractIDFromToken(authToken, secret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: err.Error()})
			c.Abort()
			return
		}

		// 设置上下文信息
		c.Set("x-user-id", userID)
		c.Next()
	}
}
