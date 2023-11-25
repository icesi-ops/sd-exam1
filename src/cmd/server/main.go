package main

import (
	"net/http"

	"github.com/gonzalodevarona/sd-exam1/src/api"
)

func main() {
	srv := api.NewServer()
	http.ListenAndServe(":8080", srv)
}
