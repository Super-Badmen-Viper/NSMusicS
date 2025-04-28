package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AnnotationController struct {
	AnnotationUsecase scene_audio_route_interface.AnnotationRepository
}

func NewAnnotationController(uc scene_audio_route_interface.AnnotationRepository) *AnnotationController {
	return &AnnotationController{AnnotationUsecase: uc}
}

// 通用参数处理结构体
type annotationQueryParams struct {
	Start string `form:"start"`
	End   string `form:"end"`
	Sort  string `form:"sort"`
	Order string `form:"order"`
}

// 获取艺术家列表
func (c *AnnotationController) GetArtistList(ctx *gin.Context) {
	params := annotationQueryParams{
		Start: ctx.DefaultQuery("start", "0"),
		End:   ctx.DefaultQuery("end", "50"),
		Sort:  ctx.DefaultQuery("sort", "created_at"),
		Order: ctx.DefaultQuery("order", "asc"),
	}

	results, err := c.AnnotationUsecase.GetArtistList(
		ctx.Request.Context(),
		params.End,
		params.Order,
		params.Sort,
		params.Start,
	)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.ArtistListResponse{
		Artists: results,
		Count:   len(results),
	})
}

// 获取专辑列表
func (c *AnnotationController) GetAlbumList(ctx *gin.Context) {
	params := annotationQueryParams{
		Start: ctx.DefaultQuery("start", "0"),
		End:   ctx.DefaultQuery("end", "50"),
		Sort:  ctx.DefaultQuery("sort", "release_date"),
		Order: ctx.DefaultQuery("order", "desc"),
	}

	results, err := c.AnnotationUsecase.GetAlbumList(
		ctx.Request.Context(),
		params.End,
		params.Order,
		params.Sort,
		params.Start,
	)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.AlbumListResponse{
		Albums: results,
		Count:  len(results),
	})
}

// 获取媒体文件列表
func (c *AnnotationController) GetMediaFileList(ctx *gin.Context) {
	params := annotationQueryParams{
		Start: ctx.DefaultQuery("start", "0"),
		End:   ctx.DefaultQuery("end", "50"),
		Sort:  ctx.DefaultQuery("sort", "play_count"),
		Order: ctx.DefaultQuery("order", "desc"),
	}

	results, err := c.AnnotationUsecase.GetMediaFileList(
		ctx.Request.Context(),
		params.End,
		params.Order,
		params.Sort,
		params.Start,
	)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.MediaFileListResponse{
		MediaFiles: results,
		Count:      len(results),
	})
}
