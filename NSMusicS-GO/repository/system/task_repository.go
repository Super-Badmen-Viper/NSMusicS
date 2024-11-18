package repository

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type taskRepository struct {
	database   mongo.Database
	collection string
}

func NewTaskRepository(db mongo.Database, collection string) system.TaskRepository {
	return &taskRepository{
		database:   db,
		collection: collection,
	}
}

func (tr *taskRepository) Create(c context.Context, task *system.Task) error {
	collection := tr.database.Collection(tr.collection)

	_, err := collection.InsertOne(c, task)

	return err
}

func (tr *taskRepository) FetchByUserID(c context.Context, userID string) ([]system.Task, error) {
	collection := tr.database.Collection(tr.collection)

	var tasks []system.Task

	idHex, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return tasks, err
	}

	cursor, err := collection.Find(c, bson.M{"userID": idHex})
	if err != nil {
		return nil, err
	}

	err = cursor.All(c, &tasks)
	if tasks == nil {
		return []system.Task{}, err
	}

	return tasks, err
}
