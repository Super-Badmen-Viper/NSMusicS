package domain

import (
	"errors"
	"strings"
)

type ErrorResponse struct {
	Message string `json:"message"`
}

var (
	ErrEmptyCollection = errors.New("config collection is empty")
)

func IsNotFound(err error) bool {
	return strings.Contains(err.Error(), "no documents in result") ||
		strings.Contains(err.Error(), "not found")
}
