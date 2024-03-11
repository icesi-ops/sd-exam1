package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"os"

	//"net"
	//"io"
	"log"
	"net/http"

	//"os"
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
var s *smb2.Session

// Inicializa la conexión a MongoDB y Samba
func init() {

    // Conexión a Samba
	conn, err_samba := net.Dial("tcp", "my-samba-container:445")
	if err_samba != nil {
		panic(err_samba)
	}
	defer conn.Close()

	d := &smb2.Dialer{
		Initiator: &smb2.NTLMInitiator{
			User:     "SAMBAUSER",
			Password: "SAMBAPASSWORD",
		},
	}

	s, err_samba = d.Dial(conn)
	if err_samba != nil {
		panic(err_samba)
	}
	fmt.Println("para ver si da error ", err_samba)
	log.Println("Conexión con el samba")

	defer s.Logoff()

	// Conexión a la base de datos
	clientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URL"))
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

    // Parsear el formulario
    err := r.ParseMultipartForm(10 << 20) // 10 MB limit
    if err != nil {
        log.Println("Error parsing form: ", err)
        http.Error(w, "Error parsing form", http.StatusBadRequest)
        return
    }
    file, _, err := r.FormFile("file")
    log.Println("File: ", file)

    if err != nil {
        log.Println("Error retrieving file: ", err)
        http.Error(w, "Error retrieving file", http.StatusBadRequest)
        return
    }

    log.Println("File: ", err)
    defer file.Close()

    // Obtener los valores de los campos del formulario
    name := r.FormValue("name")
    size := r.FormValue("size")
    fileType := "." + r.FormValue("type")

    if name == "" || size == "" || fileType == "" {
        log.Println("Missing required fields")
        http.Error(w, "Missing required fields", http.StatusBadRequest)
        return
    }

    // Crear la estructura Book
    book = Book{Name: name, Size: size, Type: fileType}
    log.Println(book)

    //Guardar el libro en la base de datos
    _, err = collection.InsertOne(context.Background(), book)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Conexión a Samba
    conn, err_samba := net.Dial("tcp", "my-samba-container:445")
    if err_samba != nil {
        panic(err_samba)
    }
    defer conn.Close()

    d := &smb2.Dialer{
        Initiator: &smb2.NTLMInitiator{
            User:     "myuser",
            Password: "mypassword",
        },
    }

    s, err_samba = d.Dial(conn)
    if err_samba != nil {
        panic(err_samba)
    }
    fmt.Println("para ver si da error ", err_samba)
    log.Println("Conexión con el samba")

    log.Println("mount antes de : ")
    if s == nil {
        log.Println("s es nil")
    }

    // Montar el recurso compartido
    fs, err := s.Mount("\\\\my-samba-container\\shared")
    log.Println("mount: ")
    if err != nil {
        panic(err)
    }

    log.Println("mount pasado el if ")

    // Crear un buffer de bytes para almacenar el contenido del archivo
    var buffer bytes.Buffer

    // Leer el contenido del archivo y escribirlo en el buffer
    _, err = io.Copy(&buffer, file)
    if err != nil {
        panic(err)
    }

    // Convertir el buffer de bytes a un slice de bytes
    archivoBytes := buffer.Bytes()

    // Ahora "archivoBytes" contiene el contenido del archivo como un slice de bytes ([]byte)
    fmt.Println("Contenido del archivo como slice de bytes: No lo vamos a mostrar de nuevo")

    // Crear o abrir un archivo en el servidor Samba
    f, err := fs.Create(name + fileType)
    if err != nil {
        panic(err)
    }
    defer fs.Remove(name +fileType)
    defer f.Close()

    smbFile, err := fs.Open(name + fileType)
    if err != nil {
        panic(err)
    }
    defer file.Close()

    fmt.Println("Pasa del fs.Open")

    // Copiar el contenido del archivo multipart al archivo en el servidor Samba
    _, err = io.Copy(smbFile, file)
    if err != nil {
        panic(err)
    }

    fmt.Println("Pasa del io.Copy")

    // Escribir contenido en el archivo
    err = fs.WriteFile(name+ fileType, archivoBytes, 0644)
    if err != nil {
        panic(err)
    }

    fmt.Println("Pasa del fs.WriteFile")

    fmt.Println("Archivo guardado en el servidor Samba.")
    defer fs.Umount()
    log.Println("Desmontado el recurso compartido")
    defer s.Logoff()
    w.WriteHeader(http.StatusOK)
    log.Println("Desconectado del servidor Samba")
    panic("terminate")
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
	address := getLocalIp()
	log.Println("address: ", address)

	registration := &consulapi.AgentServiceRegistration{
		ID:      serviceID,
		Name:    "server",
		Port:    port,
		Address: address,
		Check: &consulapi.AgentServiceCheck{
			HTTP:     fmt.Sprintf("http://%s:%v/health", address, port),
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

func getLocalIp() string {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	localAddress := conn.LocalAddr().(*net.UDPAddr)
	log.Println(localAddress.IP)

	return localAddress.IP.String()
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
	mux.HandleFunc("/upload", uploadHandler)
	mux.HandleFunc("/books", getAllBooksHandler)
	mux.HandleFunc("/health", healthCheckHandler)

	// Configura el servidor HTTP con el manejador CORS
	server := &http.Server{
		Addr:    ":9000", // Puerto en el que escucha el servidor
		Handler: corsHandler.Handler(mux),
	}

	// Inicia el servidor y maneja cualquier error que ocurra
	log.Fatal(server.ListenAndServe())
}
