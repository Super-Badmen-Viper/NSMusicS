package example_audio_interface_media_file

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

// BatchOperator 事务与批量操作接口
type BatchOperator interface {
	// 事务操作
	UpdateInTransaction(ctx context.Context,
		updateFunc func(txCtx context.Context) error,
	) error

	// 批量处理
	BatchUpdateGenre(ctx context.Context, ids []primitive.ObjectID, genre string) error
	BatchDeleteByAge(ctx context.Context, olderThan time.Duration) (int64, error)
}
type BatchOperationReport struct {
	OperationID    primitive.ObjectID
	StartTime      time.Time
	EndTime        time.Time
	TotalProcessed int
	SuccessCount   int
	FailureDetails []struct {
		ItemID    primitive.ObjectID
		ErrorCode string
		Message   string
		Retryable bool
	}
	PerformanceMetrics BatchPerformance
}
type BatchPerformance struct {
	AvgProcessingTime float64 // 毫秒
	PeakMemoryUsage   int     // MB
	Throughput        float64 // items/sec
}

//// 批量操作结果
//type BatchOperationResult struct {
//	SuccessCount int
//	Failures     []struct {
//		ID    primitive.ObjectID
//		Error string
//	}
//}
