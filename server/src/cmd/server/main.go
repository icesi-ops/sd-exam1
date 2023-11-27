package main

import (
	"net/http"

	"github.com/gonzalodevarona/sd-exam1/src/api"
	"github.com/gorilla/handlers"
)

func main() {
	srv := api.NewServer()
	http.ListenAndServe(":8005",
		handlers.CORS(
			handlers.AllowedOrigins([]string{"*"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
			handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"}),
		)(srv))
}
