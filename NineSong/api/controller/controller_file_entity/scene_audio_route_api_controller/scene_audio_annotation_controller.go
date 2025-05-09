package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AnnotationController struct {
	usecase scene_audio_route_interface.AnnotationRepository
}

func NewAnnotationController(uc scene_audio_route_interface.AnnotationRepository) *AnnotationController {
	return &AnnotationController{usecase: uc}
}

type BaseAnnotationRequest struct {
	ItemID   string `form:"item_id" binding:"required"`
	ItemType string `form:"item_type" binding:"required,oneof=artist album media"`
}

type UpdateRatingRequest struct {
	BaseAnnotationRequest
	Rating int `form:"rating" binding:"required,min=0,max=5"`
}

func (c *AnnotationController) UpdateStarred(ctx *gin.Context) {
	var req BaseAnnotationRequest
	if err := ctx.ShouldBind(&req); err != nil {
		controller.ErrorResponse(ctx, http.StatusBadRequest, "INVALID_PARAMS", err.Error())
		return
	}

	result, err := c.usecase.UpdateStarred(ctx, req.ItemID, req.ItemType)
	if err != nil {
		controller.ErrorResponse(ctx, http.StatusInternalServerError, "UPDATE_FAILED", err.Error())
		return
	}

	controller.SuccessResponse(ctx, "result", result, 1)
}

func (c *AnnotationController) UpdateUnStarred(ctx *gin.Context) {
	var req BaseAnnotationRequest
	if err := ctx.ShouldBind(&req); err != nil {
		controller.ErrorResponse(ctx, http.StatusBadRequest, "INVALID_PARAMS", err.Error())
		return
	}

	result, err := c.usecase.UpdateUnStarred(ctx, req.ItemID, req.ItemType)
	if err != nil {
		controller.ErrorResponse(ctx, http.StatusInternalServerError, "UPDATE_FAILED", err.Error())
		return
	}

	controller.SuccessResponse(ctx, "result", result, 1)
}

func (c *AnnotationController) UpdateRating(ctx *gin.Context) {
	var req UpdateRatingRequest
	if err := ctx.ShouldBind(&req); err != nil {
		controller.ErrorResponse(ctx, http.StatusBadRequest, "INVALID_PARAMS", err.Error())
		return
	}

	result, err := c.usecase.UpdateRating(ctx, req.ItemID, req.ItemType, req.Rating)
	if err != nil {
		controller.ErrorResponse(ctx, http.StatusInternalServerError, "UPDATE_FAILED", err.Error())
		return
	}

	controller.SuccessResponse(ctx, "result", result, 1)
}

func (c *AnnotationController) UpdateScrobble(ctx *gin.Context) {
	var req BaseAnnotationRequest
	if err := ctx.ShouldBind(&req); err != nil {
		controller.ErrorResponse(ctx, http.StatusBadRequest, "INVALID_PARAMS", err.Error())
		return
	}

	result, err := c.usecase.UpdateScrobble(ctx, req.ItemID, req.ItemType)
	if err != nil {
		controller.ErrorResponse(ctx, http.StatusInternalServerError, "UPDATE_FAILED", err.Error())
		return
	}

	controller.SuccessResponse(ctx, "result", result, 1)
}
