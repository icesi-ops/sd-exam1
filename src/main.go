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

	html := "<!DOCTYPE html>";
	html += "<head>";
         html += "<title> Icesi drive </title>";
	html += "</head>";
	html += "<body>";
	html += "<h1> Capacidad:  </h1> <p id=capacity> </p>";        
     	html += "<h3>Si desea subir un archivo presione</h3>";
         html += "<button id='UpLoadBut'> !Aquí¡ </button>";
    	html += "</body>"
	html += "</html>"
	
	w.Write([]byte(html))
}
