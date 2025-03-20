package domain

import "errors"

type ErrorResponse struct {
	Message string `json:"message"`
}

var (
	ErrEmptyCollection = errors.New("config collection is empty")
)
