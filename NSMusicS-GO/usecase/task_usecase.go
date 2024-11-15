package usecase

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/basic"
	"time"
)

type taskUsecase struct {
	taskRepository basic.TaskRepository
	contextTimeout time.Duration
}

func NewTaskUsecase(taskRepository basic.TaskRepository, timeout time.Duration) basic.TaskUsecase {
	return &taskUsecase{
		taskRepository: taskRepository,
		contextTimeout: timeout,
	}
}

func (tu *taskUsecase) Create(c context.Context, task *basic.Task) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	return tu.taskRepository.Create(ctx, task)
}

func (tu *taskUsecase) FetchByUserID(c context.Context, userID string) ([]basic.Task, error) {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	return tu.taskRepository.FetchByUserID(ctx, userID)
}
