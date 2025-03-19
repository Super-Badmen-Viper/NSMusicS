package bootstrap

import (
	"context"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Initializer struct {
	env *Env
	db  mongo.Database
}

func NewInitializer(env *Env, db mongo.Database) *Initializer {
	return &Initializer{env: env, db: db}
}

func (si *Initializer) CheckAndInitialize(ctx context.Context) error {
	if si.isInitialized(ctx) {
		return nil
	}
	return si.executeInitialization(ctx)
}

func (si *Initializer) isInitialized(ctx context.Context) bool {
	count, _ := si.db.Collection("system_init").CountDocuments(ctx, bson.M{"key": "initialized"})
	return count > 0
}

func (si *Initializer) executeInitialization(ctx context.Context) error {
	userID, err := si.createAdminUser(ctx)
	if err != nil {
		return err
	}

	if err := si.initDefaultSystemInfo(ctx, userID); err != nil {
		return err
	}

	if err := si.initDefaultSystemConfiguration(ctx, userID); err != nil {
		return err
	}

	return si.markInitialized(ctx)
}

func (si *Initializer) createAdminUser(ctx context.Context) (primitive.ObjectID, error) {
	user := domain_auth.User{
		ID:       primitive.NewObjectID(),
		Name:     "Test Name",
		Email:    "test@gmail.com",
		Password: "test",
	}
	encryptedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password),
		bcrypt.DefaultCost,
	)
	user.Password = string(encryptedPassword)

	result, err := si.db.Collection(domain_auth.CollectionUser).InsertOne(ctx, user)
	if err != nil {
		return primitive.NilObjectID, err
	}

	if oid, ok := result.(primitive.ObjectID); ok {
		return oid, nil
	}
	return primitive.NilObjectID, errors.New("用户ID类型转换失败")
}

func (si *Initializer) initDefaultSystemInfo(ctx context.Context, userId primitive.ObjectID) error {
	coll := si.db.Collection(domain_system.CollectionSystemInfo)

	var existing domain_system.SystemInfo
	_ = coll.FindOne(ctx, bson.M{}).Decode(&existing)

	if existing.ID.IsZero() {
		defaultInfo := &domain_system.SystemInfo{
			ID:                         userId,
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
		_, err := coll.InsertOne(ctx, defaultInfo)
		return err
	}
	return nil
}

func (si *Initializer) initDefaultSystemConfiguration(ctx context.Context, userId primitive.ObjectID) error {
	coll := si.db.Collection(domain_system.CollectionSystemConfiguration)

	var existing domain_system.SystemConfiguration
	_ = coll.FindOne(ctx, bson.M{}).Decode(&existing)

	if existing.ID.IsZero() {
		defaultConfig := &domain_system.SystemConfiguration{
			ID:                               userId,
			EnableMetrics:                    false,
			EnableNormalizedItemByNameIds:    true,
			IsPortAuthorized:                 true,
			QuickConnectAvailable:            true,
			EnableCaseSensitiveItemIds:       true,
			DisableLiveTvChannelUserDataName: true,
			MetadataPath:                     "",
			PreferredMetadataLanguage:        "zh",
			MetadataCountryCode:              "US",
			SortReplaceCharacters:            []string{".", "+", "%"},
			SortRemoveCharacters:             []string{",", "&", "-", "{", "}", "'"},
			SortRemoveWords:                  []string{"the", "a", "an"},
			MinResumePct:                     5,
			MaxResumePct:                     90,
			MinResumeDurationSeconds:         300,
			MinAudiobookResume:               5,
			MaxAudiobookResume:               5,
			InactiveSessionThreshold:         0,
			LibraryMonitorDelay:              60,
			LibraryUpdateDuration:            30,
			ImageSavingConvention:            "Legacy",
			MetadataOptions: []domain_system.MetadataOption{
				{
					ItemType:                 "Book",
					DisabledMetadataSavers:   []string{},
					LocalMetadataReaderOrder: []string{},
					DisabledMetadataFetchers: []string{},
					MetadataFetcherOrder:     []string{},
					DisabledImageFetchers:    []string{},
					ImageFetcherOrder:        []string{},
				},
				{
					ItemType:                 "Movie",
					DisabledMetadataSavers:   []string{},
					LocalMetadataReaderOrder: []string{},
					DisabledMetadataFetchers: []string{},
					MetadataFetcherOrder:     []string{},
					DisabledImageFetchers:    []string{},
					ImageFetcherOrder:        []string{},
				},
				{
					ItemType:                 "MusicVideo",
					DisabledMetadataSavers:   []string{},
					LocalMetadataReaderOrder: []string{},
					DisabledMetadataFetchers: []string{"The Open Movie Database"},
					MetadataFetcherOrder:     []string{},
					DisabledImageFetchers:    []string{"The Open Movie Database"},
					ImageFetcherOrder:        []string{},
				},
				{
					ItemType:                 "Series",
					DisabledMetadataSavers:   []string{},
					LocalMetadataReaderOrder: []string{},
					DisabledMetadataFetchers: []string{},
					MetadataFetcherOrder:     []string{},
					DisabledImageFetchers:    []string{},
					ImageFetcherOrder:        []string{},
				},
				{
					ItemType:                 "MusicAlbum",
					DisabledMetadataSavers:   []string{},
					LocalMetadataReaderOrder: []string{},
					DisabledMetadataFetchers: []string{"TheAudioDB"},
					MetadataFetcherOrder:     []string{},
					DisabledImageFetchers:    []string{},
					ImageFetcherOrder:        []string{},
				},
				{
					ItemType:                 "MusicArtist",
					DisabledMetadataSavers:   []string{},
					LocalMetadataReaderOrder: []string{},
					DisabledMetadataFetchers: []string{"TheAudioDB"},
					MetadataFetcherOrder:     []string{},
					DisabledImageFetchers:    []string{},
					ImageFetcherOrder:        []string{},
				},
				{
					ItemType:                 "BoxSet",
					DisabledMetadataSavers:   []string{},
					LocalMetadataReaderOrder: []string{},
					DisabledMetadataFetchers: []string{},
					MetadataFetcherOrder:     []string{},
					DisabledImageFetchers:    []string{},
					ImageFetcherOrder:        []string{},
				},
				{
					ItemType:                 "Season",
					DisabledMetadataSavers:   []string{},
					LocalMetadataReaderOrder: []string{},
					DisabledMetadataFetchers: []string{},
					MetadataFetcherOrder:     []string{},
					DisabledImageFetchers:    []string{},
					ImageFetcherOrder:        []string{},
				},
				{
					ItemType:                 "Episode",
					DisabledMetadataSavers:   []string{},
					LocalMetadataReaderOrder: []string{},
					DisabledMetadataFetchers: []string{},
					MetadataFetcherOrder:     []string{},
					DisabledImageFetchers:    []string{},
					ImageFetcherOrder:        []string{},
				},
			},
			SkipDeserializationForBasicTypes: true,
			ServerName:                       "",
			UICulture:                        "zh-CN",
			SaveMetadataHidden:               false,
			ContentTypes:                     []domain_system.ContentType{},
			RemoteClientBitrateLimit:         0,
			EnableFolderView:                 false,
			EnableGroupingIntoCollections:    false,
			DisplaySpecialsWithinSeasons:     true,
			CodecsUsed:                       []string{},
			PluginRepositories: []domain_system.Repository{
				{
					Name:    "Jellyfin Stable",
					Url:     "https://repo.jellyfin.org/files/plugin/manifest.json",
					Enabled: true,
				},
			},
			EnableExternalContentInSuggestions: true,
			ImageExtractionTimeoutMs:           0,
			PathSubstitutions:                  []domain_system.PathSubstitution{},
			EnableSlowResponseWarning:          true,
			SlowResponseThresholdMs:            500,
			CorsHosts:                          []string{"*"},
			ActivityLogRetentionDays:           30,
			LibraryScanFanoutConcurrency:       0,
			LibraryMetadataRefreshConcurrency:  0,
			RemoveOldPlugins:                   false,
			AllowClientLogUpload:               true,
			DummyChapterDuration:               0,
			ChapterImageResolution:             "MatchSource",
			ParallelImageEncodingLimit:         0,
			CastReceiverApplications: []domain_system.CastApp{
				{
					Id:   "F007D354",
					Name: "Stable",
				},
				{
					Id:   "6F511C87",
					Name: "Unstable",
				},
			},
			TrickplayOptions: domain_system.TrickplayConfig{
				EnableHwAcceleration:         true,
				EnableHwEncoding:             true,
				EnableKeyFrameOnlyExtraction: false,
				ScanBehavior:                 "NonBlocking",
				ProcessPriority:              "BelowNormal",
				Interval:                     10000,
				WidthResolutions:             []int{320},
				TileWidth:                    10,
				TileHeight:                   10,
				Qscale:                       4,
				JpegQuality:                  90,
				ProcessThreads:               1,
			},
			LogFileRetentionDays:     3,
			IsStartupWizardCompleted: true,
		}
		_, err := coll.InsertOne(ctx, defaultConfig)
		return err
	}
	return nil
}

func (si *Initializer) markInitialized(ctx context.Context) error {
	_, err := si.db.Collection("system_init").InsertOne(ctx, bson.M{
		"key":            "initialized",
		"value":          true,
		"initialized_at": time.Now(),
	})
	return err
}
