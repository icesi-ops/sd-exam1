package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net"

	//"net"
	//"io"
	"log"
	"net/http"
	"os"
	"strconv"

	consulapi "github.com/hashicorp/consul/api"
	"github.com/hirochachacha/go-smb2"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Define una estructura para el libro
type Book struct {
	Name string `json:"name"`
	Size string `json:"size"`
	Type string `json:"type"`
	// Agrega otros campos según tus necesidades
}

var collection *mongo.Collection
var clientMongo *mongo.Client

// Inicializa la conexión a MongoDB
func init() {

	conn, err_samba := net.Dial("tcp", "my-samba-container:445")
	if err_samba != nil {
		panic(err_samba)
	}
	defer conn.Close()

	d := &smb2.Dialer{
		Initiator: &smb2.NTLMInitiator{
			User:     "admin",
			Password: "password1",
		},
	}

	s, err_samba := d.Dial(conn)
	if err_samba != nil {
		panic(err_samba)
	}
	defer s.Logoff()

	names, err_samba := s.ListSharenames()
	if err_samba != nil {
		panic(err_samba)
	}

	for _, name := range names {
		fmt.Println(name)
	}

	clientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URL")) // Asegúrate de cambiar la URI si es necesario
	var err error
	clientMongo, err = mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Verifica la conexión a la base de datos
	err = clientMongo.Ping(context.Background(), nil)
	log.Println("Ping: ", err)
	if err != nil {
		log.Fatalf("ping mongodb error :%v", err)
		return
	}

	collection = clientMongo.Database("booksdb").Collection("books")

	log.Println("Conexión a la base de datos establecida")
}

// Endpoint para guardar un libro en la base de datos
func uploadHandler(w http.ResponseWriter, r *http.Request) {
	var book Book
	log.Println("Recibiendo libro...")
	log.Println(r)
	log.Println(r.Body)
	err := json.NewDecoder(r.Body).Decode(&book)
	log.Println("Decodificando libro...")
	log.Println(book)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Println("Recibido libro:")
	log.Println(book)

	_, err = collection.InsertOne(context.Background(), book)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = r.ParseMultipartForm(10 << 20) // 10 MB limit
	if err != nil {
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

}

// Endpoint para obtener todos los libros de la base de datos
func getAllBooksHandler(w http.ResponseWriter, r *http.Request) {
	cur, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cur.Close(context.Background())

	var books []Book
	for cur.Next(context.Background()) {
		var book Book
		err := cur.Decode(&book)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		books = append(books, book)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
}

// Endpoint para verificar la salud del servicio
func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	response := map[string]bool{"ok": true}
	json.NewEncoder(w).Encode(response)
}

func serviceRegistryWithConsul() {
	config := consulapi.DefaultConfig()
	consul, err := consulapi.NewClient(config)
	if err != nil {
		log.Println(err)
	}

	serviceID := "server"
	port, _ := strconv.Atoi(getPort()[1:len(getPort())])
	log.Printf("port: %v", port)
	address := getHostname()
	log.Println("address: ", address)

	registration := &consulapi.AgentServiceRegistration{
		ID:      serviceID,
		Name:    "server",
		Port:    port,
		Address: address,
		Check: &consulapi.AgentServiceCheck{
			HTTP:     fmt.Sprintf("http://%s:%v/api/health", address, port),
			Interval: "10s",
			Timeout:  "30s",
		},
	}

	regiErr := consul.Agent().ServiceRegister(registration)

	log.Println("register ", regiErr)

	if regiErr != nil {
		log.Printf("Failed to register service: %s:%v ", address, port)
	} else {
		log.Printf("successfully register service: %s:%v", address, port)
	}
}

func getPort() (port string) {
	port = os.Getenv("PORT")
	if len(port) == 0 {
		port = "9000"
	}
	port = ":" + port
	return
}

func getHostname() (hostname string) {
	hostname, _ = os.Hostname()
	return
}

func main() {
	// Registra el servicio con Consul
	serviceRegistryWithConsul()

	mux := http.NewServeMux()
	// Configura el manejador CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},                             // Permitir solicitudes desde cualquier origen
		AllowedMethods:   []string{http.MethodGet, http.MethodPost}, // Métodos permitidos
		AllowedHeaders:   []string{"*"},
		AllowCredentials: false,
		Debug:            true,
	})

	// Configura los manejadores para los endpoints
	mux.HandleFunc("/api/upload", uploadHandler)
	mux.HandleFunc("/api/books", getAllBooksHandler)
	mux.HandleFunc("/api/health", healthCheckHandler)

	// Configura el servidor HTTP con el manejador CORS
	server := &http.Server{
		Addr:    ":9000", // Puerto en el que escucha el servidor
		Handler: corsHandler.Handler(mux),
	}

	// Inicia el servidor y maneja cualquier error que ocurra
	log.Fatal(server.ListenAndServe())
}
