package domain_system

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SystemInfo struct {
	ID                         primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	OperatingSystemDisplayName string             `json:"operatingSystemDisplayName" bson:"operating_system_display_name"`
	HasPendingRestart          bool               `json:"hasPendingRestart" bson:"has_pending_restart"`
	IsShuttingDown             bool               `json:"isShuttingDown" bson:"is_shutting_down"`
	SupportsLibraryMonitor     bool               `json:"supportsLibraryMonitor" bson:"supports_library_monitor"`
	WebSocketPortNumber        int                `json:"webSocketPortNumber" bson:"web_socket_port_number"`
	CompletedInstallations     []string           `json:"completedInstallations" bson:"completed_installations"`
	CanSelfRestart             bool               `json:"canSelfRestart" bson:"can_self_restart"`
	CanLaunchWebBrowser        bool               `json:"canLaunchWebBrowser" bson:"can_launch_web_browser"`
	ProgramDataPath            string             `json:"programDataPath" bson:"program_data_path"`
	WebPath                    string             `json:"webPath" bson:"web_path"`
	ItemsByNamePath            string             `json:"itemsByNamePath" bson:"items_by_name_path"`
	CachePath                  string             `json:"cachePath" bson:"cache_path"`
	LogPath                    string             `json:"logPath" bson:"log_path"`
	InternalMetadataPath       string             `json:"internalMetadataPath" bson:"internal_metadata_path"`
	TranscodingTempPath        string             `json:"transcodingTempPath" bson:"transcoding_temp_path"`
	HasUpdateAvailable         bool               `json:"hasUpdateAvailable" bson:"has_update_available"`
	EncoderLocation            string             `json:"encoderLocation" bson:"encoder_location"`
	SystemArchitecture         string             `json:"systemArchitecture" bson:"system_architecture"`
	LocalAddress               string             `json:"localAddress" bson:"local_address"`
	ServerName                 string             `json:"serverName" bson:"server_name"`
	Version                    string             `json:"version" bson:"version"`
	OperatingSystem            string             `json:"operatingSystem" bson:"operating_system"`
}

type SystemInfoUsecase interface {
	Get(ctx context.Context) (*SystemInfo, error)
	Update(ctx context.Context, info *SystemInfo) error
}
