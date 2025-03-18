package repository_system_info

import (
	"context"
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system/domain_system_info"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ServerInfoRepository interface {
	Find(ctx context.Context) (*domain_system_info.ServerInfo, error)
	Update(ctx context.Context, info *domain_system_info.ServerInfo) error
}

type serverInfoRepo struct {
	db         mongo.Database
	collection string
}

func NewServerInfoRepository(env *bootstrap.Env, db mongo.Database, collection string) ServerInfoRepository {
	initDefaultServerInfo(env, db, collection)
	return &serverInfoRepo{db: db, collection: collection}
}

// 初始化默认数据
func initDefaultServerInfo(env *bootstrap.Env, db mongo.Database, collection string) {
	ctx := context.Background()
	coll := db.Collection(collection)

	var existing domain_system_info.ServerInfo
	_ = coll.FindOne(ctx, bson.M{}).Decode(&existing)

	if existing.ID.IsZero() {
		defaultInfo := &domain_system_info.ServerInfo{
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

// Find 查询数据库
func (r *serverInfoRepo) Find(ctx context.Context) (*domain_system_info.ServerInfo, error) {
	coll := r.db.Collection(r.collection)
	var info domain_system_info.ServerInfo
	err := coll.FindOne(ctx, bson.M{}).Decode(&info)
	if err != nil {
		return nil, errors.New("server info not found")
	}
	return &info, nil
}

// Update 更新数据库
func (r *serverInfoRepo) Update(ctx context.Context, info *domain_system_info.ServerInfo) error {
	coll := r.db.Collection(r.collection)
	filter := bson.M{"_id": info.ID}
	update := bson.M{
		"$set": bson.M{
			"operating_system_display_name": info.OperatingSystemDisplayName,
			"has_pending_restart":           info.HasPendingRestart,
			"is_shutting_down":              info.IsShuttingDown,
			"supports_library_monitor":      info.SupportsLibraryMonitor,
			"web_socket_port_number":        info.WebSocketPortNumber,
			"completed_installations":       info.CompletedInstallations,
			"can_self_restart":              info.CanSelfRestart,
			"can_launch_web_browser":        info.CanLaunchWebBrowser,
			"program_data_path":             info.ProgramDataPath,
			"web_path":                      info.WebPath,
			"items_by_name_path":            info.ItemsByNamePath,
			"cache_path":                    info.CachePath,
			"log_path":                      info.LogPath,
			"internal_metadata_path":        info.InternalMetadataPath,
			"transcoding_temp_path":         info.TranscodingTempPath,
			"has_update_available":          info.HasUpdateAvailable,
			"encoder_location":              info.EncoderLocation,
			"system_architecture":           info.SystemArchitecture,
			"local_address":                 info.LocalAddress,
			"server_name":                   info.ServerName,
			"version":                       info.Version,
			"operating_system":              info.OperatingSystem,
		},
	}
	opts := options.Update().SetUpsert(true)
	_, err := coll.UpdateOne(ctx, filter, update, opts)
	return err
}
