package controller_auth

import (
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_auth"
	"github.com/gin-gonic/gin"
	"net/http"
	"unicode/utf8"
)

type UpdateController struct {
	usecase *usecase_auth.UpdateUsecase
}

func NewUpdateController(uc *usecase_auth.UpdateUsecase) *UpdateController {
	return &UpdateController{usecase: uc}
}

func (c *UpdateController) UpdateUsername(ctx *gin.Context) {
	var req domain_auth.UpdateUsernameRequest
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "无效用户名格式"})
		return
	}

	// 用户名长度验证
	if utf8.RuneCountInString(req.Name) > 20 {
		ctx.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "用户名不能超过20个字符"})
		return
	}

	userID := ctx.GetString("x-user-id")
	if err := c.usecase.UpdateUsername(ctx, userID, req); err != nil {
		handleError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, domain_auth.UpdateResponse{Message: "用户名更新成功"})
}

func (c *UpdateController) UpdateEmail(ctx *gin.Context) {
	var req domain_auth.UpdateEmailRequest
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "无效邮箱格式"})
		return
	}

	userID := ctx.GetString("x-user-id")
	if err := c.usecase.UpdateEmail(ctx, userID, req); err != nil {
		handleError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, domain_auth.UpdateResponse{Message: "邮箱更新成功"})
}

func (c *UpdateController) UpdatePassword(ctx *gin.Context) {
	var req domain_auth.UpdatePasswordRequest
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "无效密码格式"})
		return
	}

	// 密码复杂度验证
	if !hasLetterAndNumber(req.NewPassword) {
		ctx.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "密码需包含字母和数字"})
		return
	}

	userID := ctx.GetString("x-user-id")
	if err := c.usecase.UpdatePassword(ctx, userID, req); err != nil {
		handleError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, domain_auth.UpdateResponse{Message: "密码更新成功"})
}

// 辅助函数
func hasLetterAndNumber(s string) bool {
	hasLetter, hasNumber := false, false
	for _, r := range s {
		switch {
		case 'a' <= r && r <= 'z', 'A' <= r && r <= 'Z':
			hasLetter = true
		case '0' <= r && r <= '9':
			hasNumber = true
		}
	}
	return hasLetter && hasNumber
}

func handleError(ctx *gin.Context, err error) {
	switch {
	case errors.Is(err, domain_auth.ErrEmailAlreadyExists):
		ctx.JSON(http.StatusConflict, domain.ErrorResponse{Message: "邮箱已被占用"})
	case errors.Is(err, domain_auth.ErrInvalidCredentials):
		ctx.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: "旧密码验证失败"})
	default:
		ctx.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: "服务器错误"})
	}
}
