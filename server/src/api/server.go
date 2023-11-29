package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/hirochachacha/go-smb2"
)

type Game struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	ReleaseYear int       `json:"release_year"`
	Image       string    `json:"image"`
}

type Server struct {
	*mux.Router

	games     []Game
	smbClient *smb2.Share
}

func NewServer() *Server {
	conn, err := net.Dial("tcp", "samba:445")
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	d := &smb2.Dialer{
		Initiator: &smb2.NTLMInitiator{
			User:     "admin",
			Password: "admin",
		},
	}

	fmt.Println("Conectado a samba " + conn.LocalAddr().String())

	client, err := d.Dial(conn)
	if err != nil {
		panic(err)
	} else {
		fmt.Println("Realicé la conexión con autenticación")
	}
	defer client.Logoff()

	fs, err := client.Mount("data")
	if err != nil {
		panic(err)
	} else {
		fmt.Println("Monté el volumen")
	}
	defer fs.Umount()

	s := &Server{
		Router:    mux.NewRouter(),
		games:     []Game{},
		smbClient: fs,
	}

	s.routes()

	// f, err := s.smbClient.Create("GRANPUTAPRUEBA.txt")

	// f.Write([]byte("Hello world!"))

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
			fmt.Println("Murio")
			return
		}

		i.ID = uuid.New()
		s.games = append(s.games, i)

		// fmt.Println(s.smbClient != nil)

		// f, err := s.smbClient.Create("GRANPUTAPRUEBA.txt")
		// if err != nil {
		// 	fmt.Println("No pude crear el archivo. " + err.Error())
		// }
		// f.Close()
		// f.Write([]byte("Hello world!"))

		// // Crear un archivo para el juego en el Samba share
		// gameFile, err := s.smbClient.Create(i.ID.String() + ".json")
		// if err != nil {
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	return
		// }
		// defer gameFile.Close()

		// // Escribir los datos del juego en el archivo
		// gameData, err := json.Marshal(i)
		// if err != nil {
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	return
		// }
		// gameFile.Write(gameData)

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
