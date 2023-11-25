package api

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type Game struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	ReleaseDate int       `json:"release_date"`
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
	return s
}

func (s *Server) routes() {
	s.HandleFunc("/games", s.getAllGames()).Methods("GET")
	s.HandleFunc("/games", s.createGame()).Methods("POST")
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
