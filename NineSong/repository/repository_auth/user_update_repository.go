package repository_auth

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type updateRepository struct {
	collection mongo.Collection
}

func NewUpdateUserRepository(db mongo.Database, collection string) domain_auth.UpdateUserRepository {
	return &updateRepository{
		collection: db.Collection(collection),
	}
}

func (r *updateRepository) UpdateName(ctx context.Context, id primitive.ObjectID, name string) error {
	_, err := r.collection.UpdateByID(
		ctx,
		id,
		bson.M{"$set": bson.M{"name": name}},
	)
	return err
}

func (r *updateRepository) UpdateEmail(ctx context.Context, id primitive.ObjectID, email string) error {
	_, err := r.collection.UpdateByID(
		ctx,
		id,
		bson.M{"$set": bson.M{"email": email}},
	)
	return err
}

func (r *updateRepository) UpdatePassword(ctx context.Context, id primitive.ObjectID, password string) error {
	_, err := r.collection.UpdateByID(
		ctx,
		id,
		bson.M{"$set": bson.M{"password": password}},
	)
	return err
}

func (r *updateRepository) IsEmailTaken(ctx context.Context, email string, excludeID primitive.ObjectID) (bool, error) {
	filter := bson.M{
		"email": email,
		"_id":   bson.M{"$ne": excludeID},
	}
	count, err := r.collection.CountDocuments(ctx, filter)
	return count > 0, err
}
