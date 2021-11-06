package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	handlers "github.com/nonsenseguy/sd-exam1/handler"
)

func newRouter() *mux.Router {
	r := mux.NewRouter()

	handlers := handlers.NewHandler()

	r.HandleFunc("/file", handlers.FetchFilesHandler).Methods("GET")
	r.HandleFunc("/file", handlers.UploadFilesHandler).Methods("POST")

	staticFileDirectory := http.Dir("./assets")
	staticFileHandler := http.StripPrefix("/assets/", http.FileServer(staticFileDirectory))
	r.PathPrefix("/assets").Handler(staticFileHandler).Methods("GET")

	return r
}

func main() {
	r := newRouter()

	log.Fatal(http.ListenAndServe(":8081", r))
}
