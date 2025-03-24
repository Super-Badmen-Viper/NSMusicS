package repository_file_entity

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"io"
	"log"
	"net/http"
	"os/exec"
	"sync"
	"time"
)

const (
	ffmpegTaskCollection = "ffmpeg_tasks"
	ffmpegTimeout        = 30 * time.Second
)

type ffmpegRepo struct {
	db        mongo.Database
	mu        sync.RWMutex
	activeMap map[primitive.ObjectID]*exec.Cmd
}

func NewFFmpegRepo(db mongo.Database) domain_file_entity.FFmpegService {
	return &ffmpegRepo{
		db:        db,
		activeMap: make(map[primitive.ObjectID]*exec.Cmd),
	}
}

func (r *ffmpegRepo) GetStatus() (bool, string) {
	// 检测FFmpeg容器是否存活
	resp, err := http.Get("http://nsmusics-ffmpeg:9000/health")
	running := err == nil && resp.StatusCode == 200
	return running, getFFmpegVersion()
}
func getFFmpegVersion() string {
	// 通过服务名称访问FFmpeg容器的/version接口
	resp, err := http.Get("http://nsmusics-ffmpeg:9000/version")
	if err != nil || resp.StatusCode != 200 {
		return "unknown"
	}
	defer resp.Body.Close()
	version, _ := io.ReadAll(resp.Body)
	return string(version)
}

func (r *ffmpegRepo) CreateTask(inputPath, outputPath string) (primitive.ObjectID, error) {
	task := &domain_file_entity.FFmpegTask{
		ID:         primitive.NewObjectID(),
		InputPath:  inputPath,
		OutputPath: outputPath,
		Status:     "queued",
		Progress:   0,
		CreatedAt:  time.Now(),
	}

	ctx, cancel := context.WithTimeout(context.Background(), ffmpegTimeout)
	defer cancel()

	if _, err := r.db.Collection(ffmpegTaskCollection).InsertOne(ctx, task); err != nil {
		return primitive.NilObjectID, err
	}

	go r.executeTask(task.ID, inputPath, outputPath)
	return task.ID, nil
}

func (r *ffmpegRepo) GetTask(id primitive.ObjectID) (*domain_file_entity.FFmpegTask, error) {
	var task domain_file_entity.FFmpegTask
	ctx, cancel := context.WithTimeout(context.Background(), ffmpegTimeout)
	defer cancel()

	err := r.db.Collection(ffmpegTaskCollection).FindOne(ctx, bson.M{"_id": id}).Decode(&task)
	return &task, err
}

func (r *ffmpegRepo) executeTask(id primitive.ObjectID, input, output string) {
	cmd := exec.Command("ffmpeg", "-i", input, output)

	r.trackProcess(id, cmd)
	defer r.cleanupProcess(id)

	r.updateTaskStatus(id, "processing", 0) // 正确传参
	if err := cmd.Run(); err != nil {
		r.updateTaskStatus(id, "failed", 0) // 正确传参
		return
	}
	r.updateTaskStatus(id, "completed", 100) // 正确传参
}

func (r *ffmpegRepo) trackProcess(id primitive.ObjectID, cmd *exec.Cmd) {
	r.mu.Lock()
	r.activeMap[id] = cmd
	r.mu.Unlock()
}

func (r *ffmpegRepo) cleanupProcess(id primitive.ObjectID) {
	r.mu.Lock()
	delete(r.activeMap, id)
	r.mu.Unlock()
}

func (r *ffmpegRepo) updateTaskStatus(id primitive.ObjectID, status string, progress int) { // 增加progress参数
	_, err := r.db.Collection(ffmpegTaskCollection).UpdateByID(
		context.Background(),
		id,
		bson.M{
			"$set": bson.M{
				"status":     status,
				"progress":   progress,
				"updated_at": time.Now(),
			},
		},
	)
	if err != nil {
		log.Printf("更新状态失败: %v", err)
	}
}
