package main

import (
	"log"
	"net/http"

	handlers "github.com/nonsenseguy/sd-exam1/handler"
)

func main() {
  handler := handlers.NewHandler()
	http.HandleFunc("/upload", handler.UploadFilesHandler)

	log.Fatal(http.ListenAndServe(":8081", nil))
}
