package main

import (
	"log"
	"net/http"

	handlers "github.com/nonsenseguy/sd-exam1/handler"
)

func main() {
	http.HandleFunc("/upload", handlers.UploadFilesHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
