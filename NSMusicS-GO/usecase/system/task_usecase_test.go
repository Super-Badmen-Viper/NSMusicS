package system_test

import (
	"context"
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system"
	system2 "github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/system"
	"testing"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestFetchByUserID(t *testing.T) {
	mockTaskRepository := new(mocks.TaskRepository)
	userObjectID := primitive.NewObjectID()
	userID := userObjectID.Hex()

	t.Run("success", func(t *testing.T) {

		mockTask := system.Task{
			ID:     primitive.NewObjectID(),
			Title:  "Test Title",
			UserID: userObjectID,
		}

		mockListTask := make([]system.Task, 0)
		mockListTask = append(mockListTask, mockTask)

		mockTaskRepository.On("FetchByUserID", mock.Anything, userID).Return(mockListTask, nil).Once()

		u := system2.NewTaskUsecase(mockTaskRepository, time.Second*2)

		list, err := u.FetchByUserID(context.Background(), userID)

		assert.NoError(t, err)
		assert.NotNil(t, list)
		assert.Len(t, list, len(mockListTask))

		mockTaskRepository.AssertExpectations(t)
	})

	t.Run("error", func(t *testing.T) {
		mockTaskRepository.On("FetchByUserID", mock.Anything, userID).Return(nil, errors.New("Unexpected")).Once()

		u := system2.NewTaskUsecase(mockTaskRepository, time.Second*2)

		list, err := u.FetchByUserID(context.Background(), userID)

		assert.Error(t, err)
		assert.Nil(t, list)

		mockTaskRepository.AssertExpectations(t)
	})

}
