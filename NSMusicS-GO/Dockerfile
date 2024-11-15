FROM golang:1.23.3
RUN mkdir /app
ADD . /app
WORKDIR /app

RUN go build -o main cmd/main.go
CMD ["/app/main"]