package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type Game struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	ReleaseYear int       `json:"release_year"`
}

type Server struct {
	*mux.Router

	games []Game
}

func NewServer() *Server {
	s := &Server{
		Router: mux.NewRouter(),
		games:  []Game{},
	}
	s.routes()

	log.Println("Server started on port 8005!")

	return s
}

func (s *Server) routes() {
	s.HandleFunc("/games", s.getAllGames()).Methods("GET")
	s.HandleFunc("/games", s.createGame()).Methods("POST")
	s.HandleFunc("/games/{id}", s.updateGame()).Methods("PUT")
	s.HandleFunc("/games/{id}", s.removeGame()).Methods("DELETE")
}

func (s *Server) createGame() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var i Game
		if err := json.NewDecoder(r.Body).Decode(&i); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		i.ID = uuid.New()
		s.games = append(s.games, i)

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(i); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (s *Server) getAllGames() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(s.games); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (s *Server) removeGame() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr, _ := mux.Vars(r)["id"]
		id, err := uuid.Parse(idStr)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		for i, item := range s.games {
			if item.ID == id {
				s.games = append(s.games[:i], s.games[i+1:]...)
				break
			}
		}
	}
}

func (s *Server) updateGame() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr, _ := mux.Vars(r)["id"]
		id, err := uuid.Parse(idStr)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var updatedGame Game
		if err := json.NewDecoder(r.Body).Decode(&updatedGame); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var foundIndex = -1
		for i, item := range s.games {
			if item.ID == id {
				foundIndex = i
				break
			}
		}

		if foundIndex == -1 {
			http.NotFound(w, r)
			return
		}

		// Update the game fields (excluding ID)
		updatedGame.ID = id
		s.games[foundIndex] = updatedGame

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(updatedGame); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
