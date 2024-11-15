package usecase_test

import (
	"context"
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/basic"
	"testing"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/basic_mocks"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestFetchByUserID(t *testing.T) {
	mockTaskRepository := new(basic_mocks.TaskRepository)
	userObjectID := primitive.NewObjectID()
	userID := userObjectID.Hex()

	t.Run("success", func(t *testing.T) {

		mockTask := basic.Task{
			ID:     primitive.NewObjectID(),
			Title:  "Test Title",
			UserID: userObjectID,
		}

		mockListTask := make([]basic.Task, 0)
		mockListTask = append(mockListTask, mockTask)

		mockTaskRepository.On("FetchByUserID", mock.Anything, userID).Return(mockListTask, nil).Once()

		u := usecase.NewTaskUsecase(mockTaskRepository, time.Second*2)

		list, err := u.FetchByUserID(context.Background(), userID)

		assert.NoError(t, err)
		assert.NotNil(t, list)
		assert.Len(t, list, len(mockListTask))

		mockTaskRepository.AssertExpectations(t)
	})

	t.Run("error", func(t *testing.T) {
		mockTaskRepository.On("FetchByUserID", mock.Anything, userID).Return(nil, errors.New("Unexpected")).Once()

		u := usecase.NewTaskUsecase(mockTaskRepository, time.Second*2)

		list, err := u.FetchByUserID(context.Background(), userID)

		assert.Error(t, err)
		assert.Nil(t, list)

		mockTaskRepository.AssertExpectations(t)
	})

}
