package domain_system

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SystemConfiguration struct {
	ID                                 primitive.ObjectID `json:"ID" bson:"_id,omitempty"`
	CachePath                          string             `json:"CachePath" bson:"cache_path"`
	PreviousVersion                    string             `json:"PreviousVersion" bson:"previous_version"`
	PreviousVersionStr                 string             `json:"PreviousVersionStr" bson:"previous_version_str"`
	EnableMetrics                      bool               `json:"EnableMetrics" bson:"enable_metrics"`
	EnableNormalizedItemByNameIds      bool               `json:"EnableNormalizedItemByNameIds" bson:"enable_normalized_item_by_name_ids"`
	IsPortAuthorized                   bool               `json:"IsPortAuthorized" bson:"is_port_authorized"`
	QuickConnectAvailable              bool               `json:"QuickConnectAvailable" bson:"quick_connect_available"`
	EnableCaseSensitiveItemIds         bool               `json:"EnableCaseSensitiveItemIds" bson:"enable_case_sensitive_item_ids"`
	DisableLiveTvChannelUserDataName   bool               `json:"DisableLiveTvChannelUserDataName" bson:"disable_live_tv_channel_user_data_name"`
	MetadataPath                       string             `json:"MetadataPath" bson:"metadata_path"`
	PreferredMetadataLanguage          string             `json:"PreferredMetadataLanguage" bson:"preferred_metadata_language"`
	MetadataCountryCode                string             `json:"MetadataCountryCode" bson:"metadata_country_code"`
	SortReplaceCharacters              []string           `json:"SortReplaceCharacters" bson:"sort_replace_characters"`
	SortRemoveCharacters               []string           `json:"SortRemoveCharacters" bson:"sort_remove_characters"`
	SortRemoveWords                    []string           `json:"SortRemoveWords" bson:"sort_remove_words"`
	MinResumePct                       int                `json:"MinResumePct" bson:"min_resume_pct"`
	MaxResumePct                       int                `json:"MaxResumePct" bson:"max_resume_pct"`
	MinResumeDurationSeconds           int                `json:"MinResumeDurationSeconds" bson:"min_resume_duration_seconds"`
	MinAudiobookResume                 int                `json:"MinAudiobookResume" bson:"min_audiobook_resume"`
	MaxAudiobookResume                 int                `json:"MaxAudiobookResume" bson:"max_audiobook_resume"`
	InactiveSessionThreshold           int                `json:"InactiveSessionThreshold" bson:"inactive_session_threshold"`
	LibraryMonitorDelay                int                `json:"LibraryMonitorDelay" bson:"library_monitor_delay"`
	LibraryUpdateDuration              int                `json:"LibraryUpdateDuration" bson:"library_update_duration"`
	ImageSavingConvention              string             `json:"ImageSavingConvention" bson:"image_saving_convention"`
	MetadataOptions                    []MetadataOption   `json:"MetadataOptions" bson:"metadata_options"`
	SkipDeserializationForBasicTypes   bool               `json:"SkipDeserializationForBasicTypes" bson:"skip_deserialization_for_basic_types"`
	ServerName                         string             `json:"ServerName" bson:"server_name"`
	UICulture                          string             `json:"UICulture" bson:"ui_culture"`
	SaveMetadataHidden                 bool               `json:"SaveMetadataHidden" bson:"save_metadata_hidden"`
	ContentTypes                       []ContentType      `json:"ContentTypes" bson:"content_types"`
	RemoteClientBitrateLimit           int                `json:"RemoteClientBitrateLimit" bson:"remote_client_bitrate_limit"`
	EnableFolderView                   bool               `json:"EnableFolderView" bson:"enable_folder_view"`
	EnableGroupingIntoCollections      bool               `json:"EnableGroupingIntoCollections" bson:"enable_grouping_into_collections"`
	DisplaySpecialsWithinSeasons       bool               `json:"DisplaySpecialsWithinSeasons" bson:"display_specials_within_seasons"`
	CodecsUsed                         []string           `json:"CodecsUsed" bson:"codecs_used"`
	PluginRepositories                 []Repository       `json:"PluginRepositories" bson:"plugin_repositories"`
	EnableExternalContentInSuggestions bool               `json:"EnableExternalContentInSuggestions" bson:"enable_external_content_in_suggestions"`
	ImageExtractionTimeoutMs           int                `json:"ImageExtractionTimeoutMs" bson:"image_extraction_timeout_ms"`
	PathSubstitutions                  []PathSubstitution `json:"PathSubstitutions" bson:"path_substitutions"`
	EnableSlowResponseWarning          bool               `json:"EnableSlowResponseWarning" bson:"enable_slow_response_warning"`
	SlowResponseThresholdMs            int64              `json:"SlowResponseThresholdMs" bson:"slow_response_threshold_ms"`
	CorsHosts                          []string           `json:"CorsHosts" bson:"cors_hosts"`
	ActivityLogRetentionDays           int                `json:"ActivityLogRetentionDays" bson:"activity_log_retention_days"`
	LibraryScanFanoutConcurrency       int                `json:"LibraryScanFanoutConcurrency" bson:"library_scan_fanout_concurrency"`
	LibraryMetadataRefreshConcurrency  int                `json:"LibraryMetadataRefreshConcurrency" bson:"library_metadata_refresh_concurrency"`
	RemoveOldPlugins                   bool               `json:"RemoveOldPlugins" bson:"remove_old_plugins"`
	AllowClientLogUpload               bool               `json:"AllowClientLogUpload" bson:"allow_client_log_upload"`
	DummyChapterDuration               int                `json:"DummyChapterDuration" bson:"dummy_chapter_duration"`
	ChapterImageResolution             string             `json:"ChapterImageResolution" bson:"chapter_image_resolution"`
	ParallelImageEncodingLimit         int                `json:"ParallelImageEncodingLimit" bson:"parallel_image_encoding_limit"`
	CastReceiverApplications           []CastApp          `json:"CastReceiverApplications" bson:"cast_receiver_applications"`
	TrickplayOptions                   TrickplayConfig    `json:"TrickplayOptions" bson:"trickplay_options"`
	LogFileRetentionDays               int                `json:"LogFileRetentionDays" bson:"log_file_retention_days"`
	IsStartupWizardCompleted           bool               `json:"IsStartupWizardCompleted" bson:"is_startup_wizard_completed"`
}
type MetadataOption struct {
	ItemType                 string   `json:"ItemType" bson:"item_type"`
	DisabledMetadataSavers   []string `json:"DisabledMetadataSavers" bson:"disabled_metadata_savers"`
	LocalMetadataReaderOrder []string `json:"LocalMetadataReaderOrder" bson:"local_metadata_reader_order"`
	DisabledMetadataFetchers []string `json:"DisabledMetadataFetchers" bson:"disabled_metadata_fetchers"`
	MetadataFetcherOrder     []string `json:"MetadataFetcherOrder" bson:"metadata_fetcher_order"`
	DisabledImageFetchers    []string `json:"DisabledImageFetchers" bson:"disabled_image_fetchers"`
	ImageFetcherOrder        []string `json:"ImageFetcherOrder" bson:"image_fetcher_order"`
}
type ContentType struct {
	Name  string `json:"Name" bson:"name"`
	Value string `json:"Value" bson:"value"`
}
type Repository struct {
	Name    string `json:"Name" bson:"name"`
	Url     string `json:"Url" bson:"url"`
	Enabled bool   `json:"Enabled" bson:"enabled"`
}
type PathSubstitution struct {
	From string `json:"From" bson:"from"`
	To   string `json:"To" bson:"to"`
}
type CastApp struct {
	Id   string `json:"Id" bson:"_id"`
	Name string `json:"Name" bson:"name"`
}
type TrickplayConfig struct {
	EnableHwAcceleration         bool   `json:"EnableHwAcceleration" bson:"enable_hw_acceleration"`
	EnableHwEncoding             bool   `json:"EnableHwEncoding" bson:"enable_hw_encoding"`
	EnableKeyFrameOnlyExtraction bool   `json:"EnableKeyFrameOnlyExtraction" bson:"enable_key_frame_only_extraction"`
	ScanBehavior                 string `json:"ScanBehavior" bson:"scan_behavior"`
	ProcessPriority              string `json:"ProcessPriority" bson:"process_priority"`
	Interval                     int    `json:"Interval" bson:"interval"`
	WidthResolutions             []int  `json:"WidthResolutions" bson:"width_resolutions"`
	TileWidth                    int    `json:"TileWidth" bson:"tile_width"`
	TileHeight                   int    `json:"TileHeight" bson:"tile_height"`
	Qscale                       int    `json:"Qscale" bson:"qscale"`
	JpegQuality                  int    `json:"JpegQuality" bson:"jpeg_quality"`
	ProcessThreads               int    `json:"ProcessThreads" bson:"process_threads"`
}

type SystemConfigurationUsecase interface {
	Get(ctx context.Context) (*SystemConfiguration, error)
	Update(ctx context.Context, info *SystemConfiguration) error
}
