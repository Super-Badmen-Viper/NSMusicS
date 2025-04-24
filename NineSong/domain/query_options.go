package domain

import (
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"time"
)

// queryOptions 查询选项配置
type queryOptions struct {
	maxTimeout     time.Duration
	allowPartial   bool
	projection     []string
	readPreference *readpref.ReadPref
}

// QueryOption 查询选项类型
type QueryOption func(*queryOptions)
