package repository_system_test

import (
	"context"
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_system"
	"testing"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestCreate(t *testing.T) {

	var databaseHelper *mocks.Database
	var collectionHelper *mocks.Collection

	databaseHelper = &mocks.Database{}
	collectionHelper = &mocks.Collection{}

	collectionName := domain_system.CollectionUser

	mockUser := &domain_system.User{
		ID:       primitive.NewObjectID(),
		Name:     "Test",
		Email:    "test@gmail.com",
		Password: "password",
	}

	mockEmptyUser := &domain_system.User{}
	mockUserID := primitive.NewObjectID()

	t.Run("success", func(t *testing.T) {

		collectionHelper.On("InsertOne", mock.Anything, mock.AnythingOfType("*domain.User")).Return(mockUserID, nil).Once()

		databaseHelper.On("Collection", collectionName).Return(collectionHelper)

		ur := repository_system.NewUserRepository(databaseHelper, collectionName)

		err := ur.Create(context.Background(), mockUser)

		assert.NoError(t, err)

		collectionHelper.AssertExpectations(t)
	})

	t.Run("error", func(t *testing.T) {
		collectionHelper.On("InsertOne", mock.Anything, mock.AnythingOfType("*domain.User")).Return(mockEmptyUser, errors.New("Unexpected")).Once()

		databaseHelper.On("Collection", collectionName).Return(collectionHelper)

		ur := repository_system.NewUserRepository(databaseHelper, collectionName)

		err := ur.Create(context.Background(), mockEmptyUser)

		assert.Error(t, err)

		collectionHelper.AssertExpectations(t)
	})

}
