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

type SystemConfigurationRepository interface {
	Find(ctx context.Context) (*domain_system.SystemConfiguration, error)
	Update(ctx context.Context, config *domain_system.SystemConfiguration) error
}

type systemConfigurationRepo struct {
	db         mongo.Database
	collection string
}

func NewSystemConfigurationRepository(env *bootstrap.Env, db mongo.Database, collection string) SystemConfigurationRepository {
	initDefaultSystemConfiguration(env, db, collection)
	return &systemConfigurationRepo{db: db, collection: collection}
}

func initDefaultSystemConfiguration(env *bootstrap.Env, db mongo.Database, collection string) {
	ctx := context.Background()
	coll := db.Collection(collection)

	var existing domain_system.SystemConfiguration
	_ = coll.FindOne(ctx, bson.M{}).Decode(&existing)

	if existing.ID.IsZero() {
		defaultConfig := &domain_system.SystemConfiguration{
			EnableMetrics:                      false,
			EnableNormalizedItemByNameIds:      false,
			IsPortAuthorized:                   false,
			QuickConnectAvailable:              false,
			EnableCaseSensitiveItemIds:         false,
			DisableLiveTvChannelUserDataName:   false,
			MetadataPath:                       "C:\\ProgramData\\Jellyfin\\Server\\metadata",
			PreferredMetadataLanguage:          "en",
			MetadataCountryCode:                "US",
			SortReplaceCharacters:              []string{},
			SortRemoveCharacters:               []string{},
			SortRemoveWords:                    []string{},
			MinResumePct:                       5,
			MaxResumePct:                       95,
			MinResumeDurationSeconds:           300,
			MinAudiobookResume:                 300,
			MaxAudiobookResume:                 3600,
			InactiveSessionThreshold:           1800,
			LibraryMonitorDelay:                60,
			LibraryUpdateDuration:              3600,
			ImageSavingConvention:              "Legacy",
			MetadataOptions:                    []domain_system.MetadataOption{},
			SkipDeserializationForBasicTypes:   false,
			ServerName:                         "JellyfinServer",
			UICulture:                          "en-US",
			SaveMetadataHidden:                 false,
			ContentTypes:                       []domain_system.ContentType{},
			RemoteClientBitrateLimit:           10000000,
			EnableFolderView:                   true,
			EnableGroupingIntoCollections:      true,
			DisplaySpecialsWithinSeasons:       true,
			CodecsUsed:                         []string{},
			PluginRepositories:                 []domain_system.Repository{},
			EnableExternalContentInSuggestions: false,
			ImageExtractionTimeoutMs:           10000,
			PathSubstitutions:                  []domain_system.PathSubstitution{},
			EnableSlowResponseWarning:          false,
			SlowResponseThresholdMs:            5000,
			CorsHosts:                          []string{},
			ActivityLogRetentionDays:           365,
			LibraryScanFanoutConcurrency:       4,
			LibraryMetadataRefreshConcurrency:  2,
			RemoveOldPlugins:                   true,
			AllowClientLogUpload:               true,
			DummyChapterDuration:               90,
			ChapterImageResolution:             "1080p",
			ParallelImageEncodingLimit:         4,
			CastReceiverApplications:           []domain_system.CastApp{},
			TrickplayOptions: domain_system.TrickplayConfig{
				EnableHwAcceleration:         false,
				EnableHwEncoding:             false,
				EnableKeyFrameOnlyExtraction: false,
				ScanBehavior:                 "Default",
				ProcessPriority:              "Normal",
				Interval:                     10,
				WidthResolutions:             []int{480, 720, 1080},
				TileWidth:                    200,
				TileHeight:                   200,
				Qscale:                       2,
				JpegQuality:                  90,
				ProcessThreads:               4,
			},
			LogFileRetentionDays:     30,
			IsStartupWizardCompleted: false,
		}
		_, _ = coll.InsertOne(ctx, defaultConfig)
	}
}

func (r *systemConfigurationRepo) Find(ctx context.Context) (*domain_system.SystemConfiguration, error) {
	coll := r.db.Collection(r.collection)
	var config domain_system.SystemConfiguration
	err := coll.FindOne(ctx, bson.M{}).Decode(&config)
	if err != nil {
		return nil, errors.New("system configuration not found")
	}
	return &config, nil
}

func (r *systemConfigurationRepo) Update(ctx context.Context, config *domain_system.SystemConfiguration) error {
	coll := r.db.Collection(r.collection)
	filter := bson.M{"_id": config.ID}
	update := bson.M{"$set": config}
	opts := options.Update().SetUpsert(true)
	_, err := coll.UpdateOne(ctx, filter, update, opts)
	return err
}
