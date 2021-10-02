package main

import (
	"net/http"

  handlers "github.com/nonsenseguy/sd-exam1/handler"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/upload", handlers.UploadFilesHandler)
	http.Handle("/", r)
}
