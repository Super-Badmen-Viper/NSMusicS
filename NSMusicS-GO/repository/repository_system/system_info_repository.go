package repository_system

import (
	"context"
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
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

func NewSystemInfoRepository(env *bootstrap.Env, db mongo.Database, collection string) SystemInfoRepository {
	//initDefaultSystemInfo(env, db, collection)
	return &systemInfoRepo{db: db, collection: collection}
}

func initDefaultSystemInfo(env *bootstrap.Env, db mongo.Database, collection string, userId string) {
	ctx := context.Background()
	coll := db.Collection(collection)

	var existing domain_system.SystemInfo
	_ = coll.FindOne(ctx, bson.M{}).Decode(&existing)

	if existing.ID.IsZero() {
		defaultInfo := &domain_system.SystemInfo{
			OperatingSystemDisplayName: "",
			HasPendingRestart:          false,
			IsShuttingDown:             false,
			SupportsLibraryMonitor:     true,
			WebSocketPortNumber:        8096,
			CompletedInstallations:     []string{},
			CanSelfRestart:             true,
			CanLaunchWebBrowser:        false,
			ProgramDataPath:            "C:\\ProgramData\\Jellyfin\\Server",
			WebPath:                    "E:\\0_Jellyfin\\Server\\jellyfin-web",
			ItemsByNamePath:            "C:\\ProgramData\\Jellyfin\\Server\\metadata",
			CachePath:                  "C:\\ProgramData\\Jellyfin\\Server\\cache",
			LogPath:                    "C:\\ProgramData\\Jellyfin\\Server\\log",
			InternalMetadataPath:       "C:\\ProgramData\\Jellyfin\\Server\\metadata",
			TranscodingTempPath:        "C:\\ProgramData\\Jellyfin\\Server\\cache\\transcodes",
			HasUpdateAvailable:         false,
			EncoderLocation:            "System",
			SystemArchitecture:         "X64",
			LocalAddress:               "http://127.0.0.1:8096",
			ServerName:                 "XIANGCHENG007",
			Version:                    "10.10.5",
			OperatingSystem:            "",
		}
		_, _ = coll.InsertOne(ctx, defaultInfo)
	}
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
	coll := r.db.Collection(r.collection)
	filter := bson.M{"_id": info.ID}
	update := bson.M{"$set": info}
	opts := options.Update().SetUpsert(true)
	_, err := coll.UpdateOne(ctx, filter, update, opts)
	return err
}
