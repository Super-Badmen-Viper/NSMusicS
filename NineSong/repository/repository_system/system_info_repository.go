package repository_system

import (
	"context"
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SystemInfoRepository interface {
	Find(ctx context.Context) (*domain_system.SystemInfo, error)
	Update(ctx context.Context, info *domain_system.SystemInfo) error
}

type systemInfoRepo struct {
	db         mongo.Database
	collection string
}

func NewSystemInfoRepository(db mongo.Database, collection string) SystemInfoRepository {
	return &systemInfoRepo{db: db, collection: collection}
}

func (r *systemInfoRepo) Find(ctx context.Context) (*domain_system.SystemInfo, error) {
	coll := r.db.Collection(r.collection)
	var info domain_system.SystemInfo
	err := coll.FindOne(ctx, bson.M{}).Decode(&info)
	if err != nil {
		return nil, errors.New("system info not found")
	}
	return &info, nil
}

func (r *systemInfoRepo) Update(ctx context.Context, info *domain_system.SystemInfo) error {
	if info.ID.IsZero() {
		return errors.New("requires non-empty user-id")
	}
	if userID, ok := ctx.Value("x-user-id").(string); ok {
		if info.ID.Hex() != userID {
			return errors.New("user mismatch with operation target")
		}
	} else {
		return errors.New("authentication required")
	}
	coll := r.db.Collection(r.collection)
	filter := bson.M{"_id": info.ID}
	update := bson.M{"$set": info}
	opts := options.Update().SetUpsert(true)
	_, err := coll.UpdateOne(ctx, filter, update, opts)
	return err
}
