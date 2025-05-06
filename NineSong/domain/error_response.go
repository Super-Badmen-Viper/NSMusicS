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
	ErrNotFound        = errors.New("not found")
)

func IsNotFound(err error) bool {
	return strings.Contains(err.Error(), "no documents in result") ||
		strings.Contains(err.Error(), "not found")
}

func WrapDomainError(err error, message string) error {
	if err == nil {
		return nil
	}
	return errors.New(message + ": " + err.Error())
}
