package bootstrap

import (
	"context"
	"errors"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_config"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_library"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"golang.org/x/crypto/bcrypt"
	"log"
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
	userID, err := si.initAdminUser(ctx)
	if err != nil {
		return err
	}

	if err := si.initAppConfigs(ctx); err != nil {
		return err
	}

	if err := si.initAppLibraryConfigs(ctx); err != nil {
		return err
	}

	if err := si.initAppAudioConfigs(ctx); err != nil {
		return err
	}

	if err := si.initAppUIConfigs(ctx); err != nil {
		return err
	}

	if err := si.initAppPlaylistIDConfigs(ctx); err != nil {
		return err
	}

	if err := si.initAppServerConfigs(ctx); err != nil {
		return err
	}

	if err := si.initAppMediaFileLibrary(ctx); err != nil {
		return err
	}

	if err := si.initSystemInfo(ctx, userID); err != nil {
		return err
	}

	if err := si.initSystemConfiguration(ctx, userID); err != nil {
		return err
	}

	if err := si.initFileEntityFolder(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityFile(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioMediaFile(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioMediaLyrics(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioMediaMv(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioMediaTrack(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioMediaKaraoke(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioAlbum(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioArtist(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioAnnotation(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioPlaylist(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioPlaylistTrack(ctx); err != nil {
		return err
	}

	if err := si.initFileEntityAudioTempMetadata(ctx); err != nil {
		return err
	}

	return si.completeInitialized(ctx)
}

func (si *Initializer) completeInitialized(ctx context.Context) error {
	_, err := si.db.Collection("system_init").InsertOne(ctx, bson.M{
		"key":            "initialized",
		"value":          true,
		"initialized_at": time.Now(),
	})
	return err
}

func (si *Initializer) initAdminUser(ctx context.Context) (primitive.ObjectID, error) {
	user := domain_auth.User{
		ID:       primitive.NewObjectID(),
		Name:     "TestName",
		Email:    "test@gmail.com",
		Password: "test123",
		Admin:    true,
	}
	encryptedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password),
		bcrypt.DefaultCost,
	)
	user.Password = string(encryptedPassword)

	result, err := si.db.Collection(domain.CollectionUser).InsertOne(ctx, user)
	if err != nil {
		return primitive.NilObjectID, err
	}

	if oid, ok := result.(primitive.ObjectID); ok {
		return oid, nil
	}
	return primitive.NilObjectID, errors.New("用户ID类型转换失败")
}

func (si *Initializer) initSystemInfo(ctx context.Context, userId primitive.ObjectID) error {
	coll := si.db.Collection(domain.CollectionSystemInfo)

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

func (si *Initializer) initSystemConfiguration(ctx context.Context, userId primitive.ObjectID) error {
	coll := si.db.Collection(domain.CollectionSystemConfiguration)

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

func (si *Initializer) initAppConfigs(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionAppConfigs)

	initConfigs := []*domain_app_config.AppConfig{
		{ConfigKey: "theme", ConfigValue: "lightTheme"},
		{ConfigKey: "lang", ConfigValue: "zhHans"},
		{ConfigKey: "router_name", ConfigValue: "home"},
		{ConfigKey: "menuOptions_selectd_model_1", ConfigValue: "false"},
		{ConfigKey: "menuOptions_selectd_model_2", ConfigValue: "false"},
		{ConfigKey: "menuOptions_selectd_model_3", ConfigValue: "false"},
		{ConfigKey: "menuOptions_selectd_model_4", ConfigValue: "false"},
		{ConfigKey: "app_view_left_menu_select_activeKey", ConfigValue: "home"},
		{ConfigKey: "app_view_left_menu_collapsed", ConfigValue: "true"},
		{ConfigKey: "model_select", ConfigValue: "server"},
		{ConfigKey: "server_select", ConfigValue: "67de9bb764e338bd6fa4b811"},
		{ConfigKey: "server_select_kind", ConfigValue: "navidrome"},
		{ConfigKey: "username", ConfigValue: "mozhi"},
		{ConfigKey: "password", ConfigValue: "qwer1234"},
		{ConfigKey: "play_order", ConfigValue: "playback-2"},
		{ConfigKey: "play_volume", ConfigValue: "100"},
		{ConfigKey: "model_server_type_of_web", ConfigValue: "true"},
		{ConfigKey: "model_server_type_of_local", ConfigValue: "false"},
		{ConfigKey: "model_server_type_of_local_server_download", ConfigValue: "false"},
		{ConfigKey: "authorization_of_nd", ConfigValue: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG0iOnRydWUsImV4cCI6MTc0MjM1NDkwOCwiaWF0IjoxNzQyMjY4NTA4LCJpc3MiOiJORCIsInN1YiI6Im1vemhpIiwidWlkIjoiN2Y2ZjZkODctZGRmMC00MjlkLTllMjEtMjU3NGJiYTY3OTRkIn0.QFXT2ZNGLPT1XxFzzrjm6CbUnG9P61weqmEN0c8ZaKo"},
		{ConfigKey: "client_unique_id", ConfigValue: "7f6f6d87-ddf0-429d-9e21-2574bba6794d"},
		{ConfigKey: "media_page_sizes", ConfigValue: "15"},
		{ConfigKey: "album_page_sizes", ConfigValue: "15"},
		{ConfigKey: "artist_page_sizes", ConfigValue: "15"},
		{ConfigKey: "clear_Memory_Model", ConfigValue: "false"},
		{ConfigKey: "clear_Equilibrium_Model", ConfigValue: "false"},
		{ConfigKey: "clear_UserExperience_Model", ConfigValue: "true"},
		{ConfigKey: "theme_auto_system", ConfigValue: "false"},
		{ConfigKey: "page_songlists_filter_year", ConfigValue: "0"},
		{ConfigKey: "player_select", ConfigValue: "mpv"},
		{ConfigKey: "player_fade_value", ConfigValue: "2000"},
		{ConfigKey: "player_dolby", ConfigValue: "false"},
		{ConfigKey: "player_samp_value", ConfigValue: "48000"},
		{ConfigKey: "player_gaplessAudio", ConfigValue: "weak"},
		{ConfigKey: "player_audioExclusiveMode", ConfigValue: "false"},
		{ConfigKey: "player_replayGainMode", ConfigValue: "no"},
		{ConfigKey: "player_replayGainPreamp", ConfigValue: "0"},
		{ConfigKey: "player_replayGainClip", ConfigValue: "false"},
		{ConfigKey: "player_replayGainFallback", ConfigValue: "0"},
		{ConfigKey: "player_mpvExtraParameters", ConfigValue: ""},
		{ConfigKey: "player_audio_channel", ConfigValue: ""},
		{ConfigKey: "player_device_select", ConfigValue: "default"},
	}

	for _, cfg := range initConfigs {
		_, err := coll.InsertOne(ctx, cfg)
		if err != nil {
			return fmt.Errorf("应用配置初始化失败: %w", err)
		}
	}
	return nil
}

func (si *Initializer) initAppLibraryConfigs(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionAppLibraryConfigs)

	initConfigs := []*domain_app_config.AppLibraryConfig{
		{ConfigKey: "0_Music", ConfigValue: "E:\\0_Music"},
		{ConfigKey: "Music", ConfigValue: "C:\\Users\\17741\\Music"},
		{ConfigKey: "iTunes", ConfigValue: "C:\\Users\\17741\\Music\\iTunes"},
	}

	for _, cfg := range initConfigs {
		_, err := coll.InsertOne(ctx, cfg)
		if err != nil {
			return fmt.Errorf("应用配置初始化失败: %w", err)
		}
	}
	return nil
}

func (si *Initializer) initAppAudioConfigs(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionAppAudioConfigs)

	initConfigs := []*domain_app_config.AppAudioConfig{
		{ConfigKey: "this_audio_file_path", ConfigValue: "http://localhost:4533/rest/stream?u=mozhi&t=be470bc4c1556004e26c4780c0121030&s=9V8he3&v=1.12.0&c=nsmusics&f=json&id=588a1fac45fd3f65c2dae2a13ced3655"},
		{ConfigKey: "this_audio_file_medium_image_url", ConfigValue: "http://localhost:4533/rest/getCoverArt?u=mozhi&t=be470bc4c1556004e26c4780c0121030&s=9V8he3&v=1.12.0&c=nsmusics&f=json&id=588a1fac45fd3f65c2dae2a13ced3655"},
		{ConfigKey: "this_audio_file_lyric", ConfigValue: "[00:00.00]History (Korean Version) - EXO-K (엑소케이)\n[00:10.39]Listen' 느낄 수 있니\n[00:13.89]내 심장이 뛰지를 않아\n[00:17.19]My heart be breakin'\n[00:18.40]분한 마음에 울어도 보고\n[00:22.71]소리 질러 하 외쳐도 봤어\n[00:26.14]My pain be creepin'\n[00:27.79]흑과 백 아직 남과 북\n[00:29.55]끝이 나지 않는 전쟁 scene\n[00:31.65]둘로 나뉜 태양의 절망\n[00:35.61]멀리 돌고 돌아서\n[00:37.75]다시 시작하는 곳에 다 왔어\n[00:41.42]오류투성이지만\n[00:42.65]배워가며 강해질 수 있는 나\n[00:44.50]저 태양처럼\n[00:45.93]거대한 하나란 걸 아는 날\n[00:50.53]오 오 모두 함께 가는 우리 미래로\n[00:53.52]I need you and you want me\n[00:55.74]지구란 이 별에서 오 오\n[01:02.41]Every every everyday\n[01:04.29]내가 만든 history\n[01:06.26]Break it 욕망의 반칙\n[01:10.72]Move it 파괴란 미덕\n[01:13.94]No more shakin' like that\n[01:15.31]Magic 시간이 가면\n[01:18.53]또 씻은 듯이 다시 재생 돼\n[01:23.70]시공간을 뛰어 넘어서\n[01:25.58]에덴의 아침을 꿈꾸고 있어\n[01:27.82]가자 우린 그런 존재\n[01:32.08]멀리 돌고 돌아서\n[01:34.02]다시 시작하는 곳에 다 왔어\n[01:37.48]오류투성이지만\n[01:38.83]배워가며 강해질 수 있는 나\n[01:40.91]저 태양처럼\n[01:42.27]거대한 하나란 걸 아는 날\n[01:46.64]오 오 모두 함께 가는 우리 미래로\n[01:49.53]I need you and you want me\n[01:51.95]지구란 이 별에서 오 오\n[01:58.69]꿈을 잉태 하는 날\n[02:00.75]우린 다시 일어나\n[02:03.58]일어나 일어나 일어나 turn it on\n[02:05.98]일어나 일어나 일어나\n[02:06.90]영원할거라 믿고 싶을 때\n[02:11.64]언젠가 할 거 라고 망설일 때\n[02:15.74]내일이 바로 끝인지도 몰라\n[02:19.89]후회 같은 건 잊어버려 두려워마\n[02:26.14]제발 사랑해 사랑해 사랑해\n[02:30.63]조화로울수록 완벽하잖아\n[02:34.84]모든 슬픔이 기쁨이 여기에\n[02:39.30]나와 너는 한 생명인 걸\n[02:41.81]Ya 우리가 원래\n[02:42.75]하나로 태어났던 순간\n[02:43.99]갈수록 소모적인\n[02:44.91]이 세계를 만난 순간\n[02:46.08]우린 점점점 멀어져가 점점\n[02:47.73]둘로 깨져버린 채\n[02:49.26]힘을 잃어버린 태양\n[02:50.30]갈수록 갈수록 갈수록 갈수록 더\n[02:52.64]간절했던 꿈의 세계를\n[02:53.74]다시 마주하는 순간\n[02:54.76]내 가슴이 뛴다 마구 뛴다\n[02:56.75]둥 둥 둥 둥 둥 둥\n[02:59.27]돌고 돌아서\n[03:00.71]다시 시작하는 곳에 다 왔어\n[03:03.87]Yeah  EXO-M  EXO-K\n[03:05.77]우리가 시작하는 미래 history\n[03:07.63]저 태양처럼\n[03:08.83]거대한 하나란 걸 아는 날\n[03:12.66]Oh 하나의 심장에 태양에\n[03:14.62]끝없이 우린\n[03:15.35]하나로 강해지고 있어\n[03:16.81]I need you and you want me\n[03:18.87]지구란 이 별에서 오 오\n[03:25.32]Every every everyday\n[03:27.24]내가 만든 history"},
		{ConfigKey: "this_audio_artist_name", ConfigValue: "EXO-K"},
		{ConfigKey: "this_audio_artist_id", ConfigValue: "fae206703a55e4c4b51c2dfff8ab21ba"},
		{ConfigKey: "this_audio_song_name", ConfigValue: "History (Korean Version)"},
		{ConfigKey: "this_audio_song_id", ConfigValue: "588a1fac45fd3f65c2dae2a13ced3655"},
		{ConfigKey: "this_audio_song_rating", ConfigValue: "0"},
		{ConfigKey: "this_audio_song_favorite", ConfigValue: "false"},
		{ConfigKey: "this_audio_album_name", ConfigValue: "'HISTORY' EXO-K 프롤로그 싱글 2nd"},
		{ConfigKey: "this_audio_album_id", ConfigValue: "311fa207db8a6edaa8a0677f9a2b565c"},
		{ConfigKey: "this_audio_Index_of_play_list", ConfigValue: "29"},
		{ConfigKey: "page_top_album_image_url", ConfigValue: "blob:file:///36af3979-c512-40f0-a2d0-9c798180d492"},
		{ConfigKey: "page_top_album_id", ConfigValue: "311fa207db8a6edaa8a0677f9a2b565c"},
		{ConfigKey: "page_top_album_name", ConfigValue: "'HISTORY' EXO-K 프롤로그 싱글 2nd"},
		{ConfigKey: "slider_singleValue", ConfigValue: "28.77"},
		{ConfigKey: "playlist_artist_id", ConfigValue: ""},
		{ConfigKey: "playlist_album_id", ConfigValue: ""},
		{ConfigKey: "playlist_album_artist_id", ConfigValue: ""},
		{ConfigKey: "page_songlists_selected", ConfigValue: "song_list_love"},
		{ConfigKey: "player_mode_of_lock_playlist", ConfigValue: "true"},
		{ConfigKey: "player_mode_of_medialist_from_external_import", ConfigValue: "false"},
	}

	for _, cfg := range initConfigs {
		_, err := coll.InsertOne(ctx, cfg)
		if err != nil {
			return fmt.Errorf("应用配置初始化失败: %w", err)
		}
	}
	return nil
}

func (si *Initializer) initAppUIConfigs(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionAppUIConfigs)

	initConfigs := []*domain_app_config.AppUIConfig{
		{ConfigKey: "player_collapsed_album", ConfigValue: "false"},
		{ConfigKey: "player_collapsed_skin", ConfigValue: "true"},
		{ConfigKey: "player_lyric_fontSize", ConfigValue: "30px"},
		{ConfigKey: "player_lyric_fontWeight", ConfigValue: "600"},
		{ConfigKey: "player_lyric_color", ConfigValue: "#FAFAFB60"},
		{ConfigKey: "player_theme_Styles_Selected", ConfigValue: "0"},
		{ConfigKey: "player_background_model_num", ConfigValue: "0"},
		{ConfigKey: "player_use_lottie_animation", ConfigValue: "true"},
		{ConfigKey: "player_use_lyric_skip_forward", ConfigValue: "true"},
		{ConfigKey: "player_use_background_filter_blur", ConfigValue: "true"},
		{ConfigKey: "player_use_background_automatic_rotation", ConfigValue: "true"},
		{ConfigKey: "player_use_background_repeat_fill", ConfigValue: "false"},
		{ConfigKey: "player_use_playbar_auto_hide", ConfigValue: "true"},
	}

	for _, cfg := range initConfigs {
		_, err := coll.InsertOne(ctx, cfg)
		if err != nil {
			return fmt.Errorf("应用配置初始化失败: %w", err)
		}
	}
	return nil
}

func (si *Initializer) initAppPlaylistIDConfigs(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionAppPlaylistIDConfigs)

	initConfigs := []*domain_app_config.AppPlaylistIDConfig{
		{ConfigKey: "001dbc8a0d6d4f32b43d8a1abf732213", ConfigValue: "1"},
		{ConfigKey: "0020641d4ba044b092b12ecc87a7bb08", ConfigValue: "2"},
		{ConfigKey: "003b46b572c14fbdb970b2dd8bd12b55", ConfigValue: "3"},
		{ConfigKey: "006a84ee61454a1487b8c3b9c2ed015f", ConfigValue: "4"},
		{ConfigKey: "0077a778a90a4e12b42256e4b44d567e", ConfigValue: "5"},
		{ConfigKey: "00800c7db99543c9ab90774cf969947e", ConfigValue: "6"},
		{ConfigKey: "00855b44ebca43708ccac91e074cc6bb", ConfigValue: "7"},
		{ConfigKey: "0087a1303c854e09b992f73dfae08493", ConfigValue: "8"},
		{ConfigKey: "0090344272a44e6088d030d6717e8a82", ConfigValue: "9"},
		{ConfigKey: "00989e7b826d4e0e8e8c3bc7dafe972a", ConfigValue: "10"},
		{ConfigKey: "00a673d2005f4210b7f44152eaf073fa", ConfigValue: "11"},
		{ConfigKey: "00b9becc259d4fd291f68fb62670cf9b", ConfigValue: "12"},
		{ConfigKey: "00c6d1acd86a42849cebd279d3db24bc", ConfigValue: "13"},
		{ConfigKey: "00c8f0edf1a24471b4910d921ed55cfb", ConfigValue: "14"},
		{ConfigKey: "0105aa09be1b48139252f9fb0b22dd98", ConfigValue: "15"},
		{ConfigKey: "010bf9eb4d1a4258b0c9cf0f5a942765", ConfigValue: "16"},
		{ConfigKey: "0115a248456d4dc8a2aa26e43378ee97", ConfigValue: "17"},
		{ConfigKey: "0116a3aeb9d74946826b492c85905f71", ConfigValue: "18"},
		{ConfigKey: "012e4bc0065043d5a4a6711ee7dba2f7", ConfigValue: "19"},
		{ConfigKey: "014a9356aa6140aa8bef387800353046", ConfigValue: "20"},
		{ConfigKey: "014b6219aa314ddabc33e49cc903c70f", ConfigValue: "21"},
		{ConfigKey: "0152e6bd233e4d98ac0829eaf7ae0a58", ConfigValue: "22"},
		{ConfigKey: "016086c1b60f4bdab1874fadf022869b", ConfigValue: "23"},
		{ConfigKey: "016697b9467b473ead2c6658a8d59316", ConfigValue: "24"},
		{ConfigKey: "0167609486474e7c930c42b9997721ec", ConfigValue: "25"},
		{ConfigKey: "016acc51bb3a4c78ab450587a9141e17", ConfigValue: "26"},
		{ConfigKey: "016b4bcb9f9443b6b39e69ba3d3fe839", ConfigValue: "27"},
		{ConfigKey: "017bb5e548d04bb0ac7bbf66382f5416", ConfigValue: "28"},
		{ConfigKey: "0187f0489c56416fa11c007f8a868daf", ConfigValue: "29"},
		{ConfigKey: "01938fb466454c8c86014df174be5924", ConfigValue: "30"},
	}

	for _, cfg := range initConfigs {
		_, err := coll.InsertOne(ctx, cfg)
		if err != nil {
			return fmt.Errorf("应用配置初始化失败: %w", err)
		}
	}
	return nil
}

func (si *Initializer) initAppServerConfigs(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionAppServerConfigs)

	id, _ := primitive.ObjectIDFromHex("67de9bb764e338bd6fa4b811")
	initConfigs := []*domain_app_config.AppServerConfig{
		{
			ID:          id,
			ServerName:  "mozhi",
			URL:         "http://localhost:4533",
			UserName:    "mozhi",
			Password:    "qwer1234",
			LastLoginAt: time.Date(2025, 3, 14, 12, 0, 26, 0, time.UTC),
			Type:        "navidrome",
		},
		{
			ID:          primitive.NewObjectID(),
			ServerName:  "xiang",
			URL:         "http://localhost:8096",
			UserName:    "xiang",
			Password:    "qwer1234",
			LastLoginAt: time.Date(2025, 3, 14, 12, 0, 26, 0, time.UTC),
			Type:        "jellyfin",
		},
		{
			ID:          primitive.NewObjectID(),
			ServerName:  "17741",
			URL:         "http://localhost:8099",
			UserName:    "17741",
			Password:    "qwer1234",
			LastLoginAt: time.Date(2025, 3, 14, 12, 0, 26, 0, time.UTC),
			Type:        "emby",
		},
	}

	for _, cfg := range initConfigs {
		_, err := coll.InsertOne(ctx, cfg)
		if err != nil {
			return fmt.Errorf("应用配置初始化失败: %w", err)
		}
	}
	return nil
}

func (si *Initializer) initAppMediaFileLibrary(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionAppMediaFileLibrarys)

	initConfigs := []*domain_app_library.AppMediaFileLibrary{
		{
			Path:                 "http://localhost:4533/rest/stream?u=mozhi&t=be470bc4c1556004e26c4780c0121030&s=9V8he3&v=1.12.0&c=nsmusics&f=json&id=0b628ce5477583033eb1e08a35aefa34",
			Title:                "唯一 (Live)",
			Album:                "2008 Music-Man 世界巡回演唱会",
			Artist:               "王力宏",
			ArtistID:             "869567954cf38a7308a21cec4d0d8f59",
			AlbumArtist:          "王力宏",
			AlbumID:              "36271841356aac2d7ae276672de2d44e",
			HasCoverArt:          false,
			TrackNumber:          0,
			DiscNumber:           0,
			Year:                 2009,
			Size:                 55186948,
			Suffix:               "flac",
			Duration:             282.39,
			BitRate:              1557,
			Genre:                "",
			Compilation:          false,
			CreatedAt:            time.Time{},
			UpdatedAt:            time.Time{},
			FullText:             "",
			AlbumArtistID:        "",
			OrderAlbumName:       "",
			OrderAlbumArtistName: "",
			OrderArtistName:      "",
			SortAlbumName:        "",
			SortArtistName:       "",
			SortAlbumArtistName:  "",
			SortTitle:            "",
			DiscSubtitle:         "",
			MBZTrackID:           "",
			MBZAlbumID:           "",
			MBZArtistID:          "",
			MBZAlbumArtistID:     "",
			MBZAlbumType:         "",
			MBZAlbumComment:      "",
			CatalogNum:           "",
			Comment:              "",
			Lyrics:               "[00:00.00]唯一 (Live) - 王力宏 (Leehom Wang)\n[00:11.02]词：王力宏\n[00:22.05]曲：王力宏\n[00:33.08]我的天空多么的清晰\n[00:38.79]透明的承诺是过去的空气\n[00:48.26]牵着我的手是你\n[00:53.18]但你的笑容 却看不清\n[01:03.43]是否一颗星星变了心\n[01:09.13]从前的愿望\n[01:11.96]也全都被抛弃\n[01:19.01]最近我无法呼吸\n[01:23.20]连自己的影子\n[01:27.42]都想逃避\n[01:31.15]Baby 你就是我的唯一\n[01:36.89]两个世界都变形\n[01:41.70]回去谈何容易\n[01:46.60]确定 你就是我的唯一\n[01:52.21]独自对着电话说我爱你\n[01:57.70]我真的爱你\n[02:01.61]Baby 我已不能多爱你一些\n[02:12.29]是否一颗星星变了心\n[02:18.04]从前的愿望\n[02:20.72]也全都被抛弃\n[02:27.51]最近我无法呼吸\n[02:31.54]连自己的影子\n[02:36.13]都想逃避逃避\n[02:43.56]Baby 你就是我的唯一\n[02:49.75]两个世界都变形\n[02:54.58]回去谈何容易\n[02:59.40]确定 你就是我的唯一\n[03:05.05]独自对着电话说我爱你\n[03:10.82]我真的爱你\n[03:15.16]Baby 我已不能多爱你一些\n[03:22.41]其实早已超过了爱的极限\n[03:46.34]Baby 你就是我的唯一\n[03:51.19]两个世界都变形\n[03:55.88]回去谈何容易\n[04:00.60]确定 你就是我的唯一\n[04:06.49]独自对着电话说我爱你\n[04:12.29]我真的爱你\n[04:16.07]Baby 我已不能多爱你一些",
			BPM:                  0,
			Channels:             0,
			OrderTitle:           "",
			MBZReleaseTrackID:    "",
			RgAlbumGain:          0.0,
			RgAlbumPeak:          0.0,
			RgTrackGain:          0.0,
			RgTrackPeak:          0.0,
			MediumImageURL:       "http://localhost:4533/rest/getCoverArt?u=mozhi&t=be470bc4c1556004e26c4780c0121030&s=9V8he3&v=1.12.0&c=nsmusics&f=json&id=0b628ce5477583033eb1e08a35aefa34",
		},
		{
			Path:                 "http://localhost:4533/rest/stream?u=mozhi&t=be470bc4c1556004e26c4780c0121030&s=9V8he3&v=1.12.0&c=nsmusics&f=json&id=0e35256b982149fef4f2d8da22e2c215",
			Title:                "恶作剧",
			Album:                "恶作剧之吻 电视剧原声带",
			Artist:               "王蓝茵",
			ArtistID:             "22d68ecf93771267f5d6891809539a68",
			AlbumArtist:          "王蓝茵",
			AlbumID:              "3972db8a900cb5e0ce87142c1cfbd724",
			HasCoverArt:          false,
			TrackNumber:          0,
			DiscNumber:           0,
			Year:                 2005,
			Size:                 3713585,
			Suffix:               "mp3",
			Duration:             226.82,
			BitRate:              128,
			Genre:                "",
			Compilation:          false,
			CreatedAt:            time.Time{},
			UpdatedAt:            time.Time{},
			FullText:             "",
			AlbumArtistID:        "",
			OrderAlbumName:       "",
			OrderAlbumArtistName: "",
			OrderArtistName:      "",
			SortAlbumName:        "",
			SortArtistName:       "",
			SortAlbumArtistName:  "",
			SortTitle:            "",
			DiscSubtitle:         "",
			MBZTrackID:           "",
			MBZAlbumID:           "",
			MBZArtistID:          "",
			MBZAlbumArtistID:     "",
			MBZAlbumType:         "",
			MBZAlbumComment:      "",
			CatalogNum:           "",
			Comment:              "",
			Lyrics:               "[00:00.00]恶作剧 - 王蓝茵 (Tangerine Wang)\n[00:06.16]词：王蓝茵\n[00:12.32]曲：王蓝茵\n[00:18.48]编曲：吴薇薇\n[00:24.64]制作人：吴薇薇/林迈可\n[00:30.81]我找不到很好的原因\n[00:34.27]去阻挡这一切的亲密\n[00:38.00]这感觉太奇异\n[00:39.75]我抱歉不能说明\n[00:44.89]我相信这爱情的定义\n[00:48.36]奇迹会发生也不一定\n[00:52.17]风温柔的清晰\n[00:53.94]也许飘来好消息\n[00:58.95]一切新鲜 有点冒险\n[01:02.43]请告诉我怎么走到终点\n[01:05.93]没有人了解\n[01:07.57]没有人像我和陌生人的爱恋\n[01:13.02]我想我会开始想念你\n[01:16.54]可是我刚刚才遇见了你\n[01:20.84]我怀疑这奇遇只是个恶作剧\n[01:27.15]我想我已慢慢喜欢你\n[01:30.63]因为我拥有爱情的勇气\n[01:34.86]我任性投入你给的恶作剧\n[01:40.22]你给的恶作剧\n[02:06.03]我找不到很好的原因\n[02:09.57]去阻挡这一切的亲密\n[02:13.34]这感觉太奇异\n[02:15.09]我抱歉不能说明\n[02:20.08]我相信这爱情的定义\n[02:23.65]奇迹会发生也不一定\n[02:27.46]风温柔的清晰\n[02:29.19]也许飘来好消息\n[02:34.19]我才发现 你很耀眼\n[02:37.75]请让我再瞧瞧你的双眼\n[02:41.26]没有人了解\n[02:42.84]没有人像我和陌生人的爱恋\n[02:50.17]我想我会开始想念你\n[02:53.64]可是我刚刚才遇见了你\n[02:57.82]我怀疑这奇遇只是个恶作剧\n[03:04.19]我想我已慢慢喜欢你\n[03:07.77]因为我拥有爱情的勇气\n[03:11.98]我任性投入你给的恶作剧\n[03:17.29]你给的恶作剧",
			BPM:                  0,
			Channels:             0,
			OrderTitle:           "",
			MBZReleaseTrackID:    "",
			RgAlbumGain:          0.0,
			RgAlbumPeak:          0.0,
			RgTrackGain:          0.0,
			RgTrackPeak:          0.0,
			MediumImageURL:       "http://localhost:4533/rest/getCoverArt?u=mozhi&t=be470bc4c1556004e26c4780c0121030&s=9V8he3&v=1.12.0&c=nsmusics&f=json&id=0e35256b982149fef4f2d8da22e2c215",
		},
		{
			Path:                 "http://localhost:4533/rest/stream?u=mozhi&t=be470bc4c1556004e26c4780c0121030&s=9V8he3&v=1.12.0&c=nsmusics&f=json&id=134d47460ed29e6df249df31ff55240c",
			Title:                "BANG BANG BANG+FANTASTIC BABY (2024 MAMA日本场DAY2)",
			Album:                "SPECIAL FINAL IN DOME MEMORIAL COLLECTION",
			Artist:               "BIGBANG",
			ArtistID:             "f447df8362a4d0d9f5142f563595684b",
			AlbumArtist:          "BIGBANG",
			AlbumID:              "e54218a2075604a8b735088ed34bb93a",
			HasCoverArt:          false,
			TrackNumber:          0,
			DiscNumber:           0,
			Year:                 2012,
			Size:                 4123294,
			Suffix:               "mp3",
			Duration:             252.94,
			BitRate:              128,
			Genre:                "",
			Compilation:          false,
			CreatedAt:            time.Time{},
			UpdatedAt:            time.Time{},
			FullText:             "",
			AlbumArtistID:        "",
			OrderAlbumName:       "",
			OrderAlbumArtistName: "",
			OrderArtistName:      "",
			SortAlbumName:        "",
			SortArtistName:       "",
			SortAlbumArtistName:  "",
			SortTitle:            "",
			DiscSubtitle:         "",
			MBZTrackID:           "",
			MBZAlbumID:           "",
			MBZArtistID:          "",
			MBZAlbumArtistID:     "",
			MBZAlbumType:         "",
			MBZAlbumComment:      "",
			CatalogNum:           "",
			Comment:              "",
			Lyrics:               "[00:00.10]FANTASTIC BABY (Bonus Track) - BIGBANG (빅뱅)\n[00:00.20]词：G-DRAGON/T.O.P/VERBAL\n[00:00.30]曲：TEDDY/G-DRAGON\n[00:00.31]夜が来た 目覚ましな\n[00:04.39]We Gon Party Like\n[00:05.83]Li Li Li La La La\n[00:08.10]集まりな\n[00:09.92]このPartyは\n[00:11.78]これからさ\n[00:13.20]Li Li Li La La La\n[00:15.20]瞬間でキャッチした\n[00:17.32]その目はまだ\n[00:18.93]遊び足りてない\n[00:21.00]Alright\n[00:22.61]半分でも興味あるならば\n[00:25.61]We Go\n[00:26.29]さぁ行こう 好きに騒ごう\n[00:29.79]Nah Na Na Nah Nah\n[00:31.57]Nah Na Na Nah Nah\n[00:33.41]Wow Fantastic Baby\n[00:35.29]Dance\n[00:38.28]I Wanna Dan Dan Dan Dan Dance\n[00:41.53]Fantastic Baby\n[00:42.65]Dance\n[00:45.68]I Wanna Dan Dan Dan Dan Dance\n[00:48.23]Wow Fantastic Baby\n[00:50.38]いかがかね?\n[00:52.09]僕ちゃんはパーフェクト\n[00:54.04]弱点探すのなんて\n[00:55.91]100年早い\n[00:57.05]Baby\n[00:57.67]真っ赤な太陽よりも\n[01:00.19]Fire\n[01:01.33]直視すれば\n[01:02.55]Burn Dah Na Na Nah Nah\n[01:04.61]まだずっと凝り固まってる\n[01:06.20]みなさん単純に\n[01:08.04]これからJumpって言ったら\n[01:09.50]飛び跳ねな\n[01:10.25]On 1, 2, 3\n[01:11.77]高く空中に\n[01:13.62]オレは操縦士さ\n[01:15.81]初めてなら今から\n[01:16.86]連れて行こうか\n[01:17.86]宇宙に\n[01:19.43]Danger!\n[01:20.52]鳴らせサイレン\n[01:22.39]君はターゲット\n[01:24.26]僕のターゲット\n[01:25.93]走れ\n[01:27.00]I Can't Baby Don't Stop This\n[01:29.56]終わらせないで この未体験な\n[01:33.21]サウンドを\n[01:39.91]Wow Fantastic Baby\n[01:41.76]Dance\n[01:44.79]I Wanna Dan Dan Dan Dan Dance\n[01:47.89]Fantastic Baby\n[01:49.05]Dance\n[01:52.11]I Wanna Dan Dan Dan Dan Dance\n[01:54.69]Wow Fantastic Baby\n[01:56.56]Boom Shaka Laka\n[01:58.36]Boom Shaka Laka\n[02:00.22]Boom Shaka Laka\n[02:02.06]Dan Dan Dan Dan Dance\n[02:03.89]Boom Shaka Laka\n[02:05.78]Boom Shaka Laka\n[02:07.61]Boom Shaka Laka\n[02:09.43]Dan Dan Dance\n[02:10.97]なんだかジャンク好きだから\n[02:13.86]なんでも来い今夜は\n[02:15.75]特に拒まない\n[02:17.32]Digi-Dum-Dum\n[02:18.76]Mama Just Let Me Be Your Lover\n[02:21.25]今すぐ出ようか かかかか\n[02:24.25]Nah Na Na Nah Nah\n[02:25.96]ノリだけなら昔からテキトー\n[02:29.63]目が合うだけで彼女アプローチ\n[02:32.98]勘ぐるはずまずマーク\n[02:35.35]狙い定めたら\n[02:37.11]バキュン バキュン バキュン\n[02:38.64]Hold Up\n[02:39.10]Nah Na Na Nah Nah\n[02:40.80]Danger!\n[02:41.79]鳴らせサイレン\n[02:43.62]君はターゲット\n[02:45.59]僕のターゲット\n[02:47.17]走れ\n[02:48.21]I Can't Baby Don't Stop This\n[02:50.77]終わらせないで\n[02:52.65]この未体験な\n[02:54.42]サウンドを\n[03:01.08]Wow Fantastic Baby\n[03:02.96]Dance\n[03:05.95]I Wanna Dan Dan Dan Dan Dance\n[03:09.18]Fantastic Baby\n[03:10.31]Dance\n[03:13.37]I Wanna Dan Dan Dan Dan Dance\n[03:15.92]Wow Fantastic Baby\n[03:17.72]Boom Shaka Laka\n[03:19.55]Boom Shaka Laka\n[03:21.40]Boom Shaka Laka\n[03:23.27]Dan Dan Dan Dan Dance\n[03:25.15]Boom Shaka Laka\n[03:27.00]Boom Shaka Laka\n[03:28.81]Boom Shaka Laka\n[03:30.62]Dan-Dan-Dan Dan Dance\n[03:32.52]さぁ選ぼうか\n[03:34.80]Yeh Yeh Yeh\n[03:36.21]敗者か勝者\n[03:38.50]Yeh Yeh Yeh\n[03:39.88]僕なら後者\n[03:42.18]Yeh Yeh Yeh\n[03:43.58]君とは今夜\n[03:45.38]Wow Fantastic Baby",
			BPM:                  0,
			Channels:             0,
			OrderTitle:           "",
			MBZReleaseTrackID:    "",
			RgAlbumGain:          0.0,
			RgAlbumPeak:          0.0,
			RgTrackGain:          0.0,
			RgTrackPeak:          0.0,
			MediumImageURL:       "http://localhost:4533/rest/getCoverArt?u=mozhi&t=be470bc4c1556004e26c4780c0121030&s=9V8he3&v=1.12.0&c=nsmusics&f=json&id=134d47460ed29e6df249df31ff55240c",
		},
	}

	for _, cfg := range initConfigs {
		_, err := coll.InsertOne(ctx, cfg)
		if err != nil {
			return fmt.Errorf("应用配置初始化失败: %w", err)
		}
	}
	return nil
}

func (si *Initializer) initFileEntityFolder(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityFolderInfo)

	initConfigs := []*domain_file_entity.FolderMetadata{
		// 音频文件夹示例（包含多文件元数据）
		{
			ID:         primitive.NewObjectID(),
			FolderPath: "c:/users/17741/Music",
			FolderMeta: domain_file_entity.FolderMeta{
				FileCount:   0,
				LastScanned: time.Now(),
			},
		},
		// 视频监控目录（含子文件夹）
		{
			ID:         primitive.NewObjectID(),
			FolderPath: "c:/users/17741/Videos",
			FolderMeta: domain_file_entity.FolderMeta{
				FileCount:   0,
				LastScanned: time.Now(),
			},
		},
		// 图片资源库（按年份组织）
		{
			ID:         primitive.NewObjectID(),
			FolderPath: "c:/users/17741/Pictures",
			FolderMeta: domain_file_entity.FolderMeta{
				FileCount:   0,
				LastScanned: time.Now(),
			},
		},
		//// 文档共享目录（企业级）
		//{
		//
		//},
		//// 系统日志目录（带访问控制）
		//{
		//
		//},
		//// 数据库备份目录（新增类型）
		//{
		//
		//},
	}

	// 批量插入优化
	models := make([]interface{}, len(initConfigs))
	for i, cfg := range initConfigs {
		models[i] = cfg
	}

	if _, err := coll.InsertMany(ctx, models); err != nil {
		log.Println(err)
	}
	return nil
}

func (si *Initializer) initFileEntityFile(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityFileInfo)

	dummyID := primitive.NewObjectID()
	emptyDoc := &domain_file_entity.FileMetadata{
		ID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": dummyID}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioMediaFile(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioMediaFile)

	dummyID := primitive.NewObjectID()
	emptyDoc := &scene_audio_db_models.MediaFileMetadata{
		ID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": dummyID}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioMediaLyrics(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioMediaLyricsMetadata)

	dummyID := primitive.NewObjectID()
	emptyDoc := &scene_audio_db_models.MediaLyricsMetadata{
		ID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": dummyID}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioMediaMv(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioMediaMvMetadata)

	dummyID := primitive.NewObjectID()
	emptyDoc := &scene_audio_db_models.MediaMvMetadata{
		ID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": dummyID}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioMediaTrack(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioMediaTrackMetadata)

	dummyID := primitive.NewObjectID()
	emptyDoc := &scene_audio_db_models.MediaTrackMetadata{
		ID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": dummyID}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioMediaKaraoke(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioMediaKaraokeMetadata)

	dummyID := primitive.NewObjectID()
	emptyDoc := &scene_audio_db_models.MediaKaraokeMetadata{
		ID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": dummyID}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioAlbum(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioAlbum)

	dummyID := primitive.NewObjectID()
	emptyDoc := &scene_audio_db_models.AlbumMetadata{
		ID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": dummyID}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioArtist(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioArtist)

	dummyID := primitive.NewObjectID()
	emptyDoc := &scene_audio_db_models.ArtistMetadata{
		ID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": dummyID}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioAnnotation(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioAnnotation)

	dummyID := primitive.NewObjectID()
	emptyDoc := &scene_audio_db_models.AnnotationMetadata{
		AnnID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": dummyID}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioPlaylist(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioPlaylist)

	dummyID := primitive.NewObjectID()
	emptyDoc := &scene_audio_db_models.PlaylistMetadata{
		ID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": dummyID}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioPlaylistTrack(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioPlaylistTrack)

	dummyID := primitive.NewObjectID()
	emptyDoc := &scene_audio_db_models.PlaylistTrackMetadata{
		ID: dummyID,
	}

	if _, err := coll.InsertOne(ctx, emptyDoc); err != nil {
		return err
	}

	if _, err := coll.DeleteOne(ctx, bson.M{"_id": 0}); err != nil {
		return err
	}

	return nil
}

func (si *Initializer) initFileEntityAudioTempMetadata(ctx context.Context) error {
	coll := si.db.Collection(domain.CollectionFileEntityAudioTempMetadata)

	initConfigs := []*scene_audio_db_models.ExternalResource{
		{
			ID:           primitive.NewObjectID(),
			MetadataType: "cover",
			FolderPath:   "c:/Users/Public/Documents/NineSong/MetaData/Cover",
		},
		{
			ID:           primitive.NewObjectID(),
			MetadataType: "lyrics",
			FolderPath:   "c:/Users/Public/Documents/NineSong/MetaData/Lyrics",
		},
		{
			ID:           primitive.NewObjectID(),
			MetadataType: "steam",
			FolderPath:   "c:/Users/Public/Documents/NineSong/MetaData/Steam",
		},
	}

	// 批量插入优化
	models := make([]interface{}, len(initConfigs))
	for i, cfg := range initConfigs {
		models[i] = cfg
	}

	if _, err := coll.InsertMany(ctx, models); err != nil {
		log.Println(err)
	}
	return nil
}
