package system

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system"
	"time"
)

type taskUsecase struct {
	taskRepository system.TaskRepository
	contextTimeout time.Duration
}

func NewTaskUsecase(taskRepository system.TaskRepository, timeout time.Duration) system.TaskUsecase {
	return &taskUsecase{
		taskRepository: taskRepository,
		contextTimeout: timeout,
	}
}

func (tu *taskUsecase) Create(c context.Context, task *system.Task) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	return tu.taskRepository.Create(ctx, task)
}

func (tu *taskUsecase) FetchByUserID(c context.Context, userID string) ([]system.Task, error) {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	return tu.taskRepository.FetchByUserID(ctx, userID)
}
