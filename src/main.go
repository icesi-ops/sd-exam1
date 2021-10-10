package main

import (
	"log"
	"net/http"

	handlers "github.com/nonsenseguy/sd-exam1/handler"
)

func main() {
  handler := handlers.NewHandler()
  
  http.HandleFunc("/", home)

	http.HandleFunc("/upload", handler.UploadFilesHandler)
  http.HandleFunc("/files", handler.FetchFilesHandler)

	log.Fatal(http.ListenAndServe(":8081", nil))
}

func home(w http.ResponseWriter, r *http.Request){

	html := "<html>";
	html += "<body>";
	html += "<h1>Hola Mundo </h1>";
	html += "</body>";
	html += "</html>";
	
	w.Write([]byte(html))
}
