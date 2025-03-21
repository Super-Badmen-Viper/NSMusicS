package bootstrap

import (
	"context"
	"errors"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
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

	if err := si.initSystemInfo(ctx, userID); err != nil {
		return err
	}

	if err := si.initSystemConfiguration(ctx, userID); err != nil {
		return err
	}

	return si.markInitialized(ctx)
}

func (si *Initializer) markInitialized(ctx context.Context) error {
	_, err := si.db.Collection("system_init").InsertOne(ctx, bson.M{
		"key":            "initialized",
		"value":          true,
		"initialized_at": time.Now(),
	})
	return err
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

	initConfigs := []*domain_app.AppConfig{
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
		{ConfigKey: "server_select", ConfigValue: "2b876e61-a2a7-4ebc-97d1-b9bbd7a9592c"},
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

	initConfigs := []*domain_app.AppLibraryConfig{
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

	initConfigs := []*domain_app.AppAudioConfig{
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

	initConfigs := []*domain_app.AppUIConfig{
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

	initConfigs := []*domain_app.AppPlaylistIDConfig{
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

	initConfigs := []*domain_app.AppServerConfig{
		{
			ServerName:  "mozhi",
			URL:         "http://localhost:4533",
			UserName:    "mozhi",
			Password:    "qwer1234",
			LastLoginAt: time.Date(2025, 3, 14, 12, 0, 26, 0, time.UTC),
			Type:        "navidrome",
		},
		{
			ServerName:  "xiang",
			URL:         "http://localhost:8096",
			UserName:    "xiang",
			Password:    "0707",
			LastLoginAt: time.Date(2025, 3, 14, 12, 0, 26, 0, time.UTC),
			Type:        "jellyfin",
		},
		{
			ServerName:  "17741",
			URL:         "http://localhost:8099",
			UserName:    "17741",
			Password:    "C24ckkT.cRZT7bS",
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
