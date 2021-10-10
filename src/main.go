package main

import (
	"log"
	"net/http"

	handlers "github.com/nonsenseguy/sd-exam1/handler"
)

func main() {
  handler := handlers.NewHandler()
  fs:= http.FileServer(http.Dir("./static"))
  
  http.HandleFunc("/", fs)

	http.HandleFunc("/upload", handler.UploadFilesHandler)
  http.HandleFunc("/files", handler.FetchFilesHandler)
  
  http.HandleFunc("/archivo", archivo)

	log.Fatal(http.ListenAndServe(":8081", nil))
}

func home(w http.ResponseWriter, r *http.Request){

	html := "<!DOCTYPE html>";
	html += "<head>";
         html += "<title> Icesi drive </title>";
	html += "</head>";
	html += "<body>";
	html += "<label> Capacidad:  </label> <p id=capacity> </p>";
	html += "<form>"; 
	html += "<label>Si desea subir un archivo presione</label>";
	html += "<h3>Si desea subir un archivo presione</h3>";
	html += "</form>";      

    	html += "</body>";
	html += "</html>";
	
	w.Write([]byte(html))
}

func archivo(w http.ResponseWriter, r *http.Request){

	
}
