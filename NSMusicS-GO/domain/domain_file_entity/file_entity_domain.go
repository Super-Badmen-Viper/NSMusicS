package domain_file_entity

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"os/exec"
	"strings"
	"time"
)

type FileType int

const (
	Audio FileType = iota + 1
	Video
	Image
	Text
	Document
	Archive
	Unknown
)

type FileMetadata struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	FolderPath string             `bson:"folder_path"`
	FileType   FileType           `bson:"file_type"`
	Size       int64              `bson:"size"`
	ModTime    time.Time          `bson:"mod_time"`
	Checksum   string             `bson:"checksum"`
	CreatedAt  time.Time          `bson:"created_at"`
	UpdatedAt  time.Time          `bson:"updated_at"`
}

type FFmpegTask struct {
	ID         primitive.ObjectID `bson:"_id"`
	InputPath  string             `bson:"input_path"`
	OutputPath string             `bson:"output_path"`
	Status     string             `bson:"status"`   // queued/processing/completed/failed
	Progress   int                `bson:"progress"` // 0-100
	CreatedAt  time.Time          `bson:"created_at"`
	UpdatedAt  time.Time          `bson:"updated_at"`
}

type FileRepository interface {
	Upsert(ctx context.Context, file *FileMetadata) error
	Delete(ctx context.Context, filePath string) error
}

type FFmpegService interface {
	GetStatus() (running bool, version string)
	CreateTask(inputPath, outputPath string) (primitive.ObjectID, error)
	GetTask(id primitive.ObjectID) (*FFmpegTask, error)
}

type FileDetector interface {
	DetectMediaType(filePath string) (FileType, error)
}

type FFmpegDetector struct{}

func (fd *FFmpegDetector) DetectMediaType(filePath string) (FileType, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "ffprobe",
		"-v", "error",
		"-show_entries", "format=format_name",
		"-of", "default=nw=1",
		filePath)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return Unknown, fmt.Errorf("ffprobe执行失败: %w", err)
	}

	// 直接解析输出（原parseFFmpegOutput逻辑）
	trimmed := strings.ToLower(strings.TrimSpace(string(output)))
	switch {
	case strings.Contains(trimmed, "mp3") || strings.Contains(trimmed, "aac"):
		return Audio, nil
	case strings.Contains(trimmed, "h264") || strings.Contains(trimmed, "hevc"):
		return Video, nil
	case strings.Contains(trimmed, "png") || strings.Contains(trimmed, "jpeg"):
		return Image, nil
	default:
		return Unknown, nil
	}
}
