package scene_audio_route_api_controller

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AnnotationController struct {
	usecase scene_audio_route_interface.AnnotationRepository
}

func NewAnnotationController(uc scene_audio_route_interface.AnnotationRepository) *AnnotationController {
	return &AnnotationController{usecase: uc}
}

// region Common Tools
func (c *AnnotationController) parsePagination(ctx *gin.Context) (start, end string) {
	start = ctx.DefaultQuery("start", "0")
	end = ctx.DefaultQuery("end", "50")
	return
}

func (c *AnnotationController) parseID(ctx *gin.Context) string {
	return ctx.Param("id")
}

// endregion

// region Artist Endpoints
func (c *AnnotationController) GetArtistList(ctx *gin.Context) {
	start, end := c.parsePagination(ctx)

	artists, err := c.usecase.GetArtistList(ctx, end, start)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.ArtistListResponse{
		Artists: artists,
		Count:   len(artists),
	})
}

func (c *AnnotationController) GetRandomArtistList(ctx *gin.Context) {
	start, end := c.parsePagination(ctx)

	artists, err := c.usecase.GetRandomArtistList(ctx, end, start)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.ArtistListResponse{
		Artists: artists,
		Count:   len(artists),
	})
}

// endregion

// region Album Endpoints
func (c *AnnotationController) GetAlbumList(ctx *gin.Context) {
	start, end := c.parsePagination(ctx)

	albums, err := c.usecase.GetAlbumList(ctx, end, start)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.AlbumListResponse{
		Albums: albums,
		Count:  len(albums),
	})
}

func (c *AnnotationController) GetRandomAlbumList(ctx *gin.Context) {
	start, end := c.parsePagination(ctx)

	albums, err := c.usecase.GetRandomAlbumList(ctx, end, start)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.AlbumListResponse{
		Albums: albums,
		Count:  len(albums),
	})
}

// endregion

// region MediaFile Endpoints
func (c *AnnotationController) GetMediaFileList(ctx *gin.Context) {
	start, end := c.parsePagination(ctx)

	mediaFiles, err := c.usecase.GetMediaFileList(ctx, end, start)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.MediaFileListResponse{
		MediaFiles: mediaFiles,
		Count:      len(mediaFiles),
	})
}

func (c *AnnotationController) GetRandomMediaFileList(ctx *gin.Context) {
	start, end := c.parsePagination(ctx)

	mediaFiles, err := c.usecase.GetRandomMediaFileList(ctx, end, start)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scene_audio_route_models.MediaFileListResponse{
		MediaFiles: mediaFiles,
		Count:      len(mediaFiles),
	})
}

// endregion

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
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := c.usecase.UpdateStarred(ctx, req.ItemID, req.ItemType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, result)
}

func (c *AnnotationController) UpdateUnStarred(ctx *gin.Context) {
	var req BaseAnnotationRequest
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := c.usecase.UpdateUnStarred(ctx, req.ItemID, req.ItemType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, result)
}

func (c *AnnotationController) UpdateRating(ctx *gin.Context) {
	var req UpdateRatingRequest
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := c.usecase.UpdateRating(ctx, req.ItemID, req.ItemType, req.Rating)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, result)
}

func (c *AnnotationController) UpdateScrobble(ctx *gin.Context) {
	var req BaseAnnotationRequest
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := c.usecase.UpdateScrobble(ctx, req.ItemID, req.ItemType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, result)
}
