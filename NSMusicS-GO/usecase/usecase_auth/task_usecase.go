package usecase_auth

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_auth"
	"time"
)

type taskUsecase struct {
	taskRepository domain_auth.TaskRepository
	contextTimeout time.Duration
}

func NewTaskUsecase(taskRepository domain_auth.TaskRepository, timeout time.Duration) domain_auth.TaskUsecase {
	return &taskUsecase{
		taskRepository: taskRepository,
		contextTimeout: timeout,
	}
}

func (tu *taskUsecase) Create(c context.Context, task *domain_auth.Task) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	return tu.taskRepository.Create(ctx, task)
}

func (tu *taskUsecase) FetchByUserID(c context.Context, userID string) ([]domain_auth.Task, error) {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	return tu.taskRepository.FetchByUserID(ctx, userID)
}
