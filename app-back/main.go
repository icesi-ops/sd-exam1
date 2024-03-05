package main

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"

)

// Define una estructura para el libro
type Book struct {
    Title  string `json:"title"`
    Size string `json:"size"`
    Type string `json:"type"`
    // Agrega otros campos según tus necesidades
}

var client *mongo.Client

// Inicializa la conexión a MongoDB
func init() {
    clientOptions := options.Client().ApplyURI("mongodb://mongodb:27017") // Asegúrate de cambiar la URI si es necesario
    var err error
    client, err = mongo.Connect(context.Background(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }
}

// Endpoint para guardar un libro en la base de datos
func uploadHandler(w http.ResponseWriter, r *http.Request) {
    var book Book
    err := json.NewDecoder(r.Body).Decode(&book)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    log.Println("Recibido libro:")
    log.Println(book)

    collection := client.Database("booksdb").Collection("books")
    _, err = collection.InsertOne(context.Background(), book)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
}

// Endpoint para obtener todos los libros de la base de datos
func getAllBooksHandler(w http.ResponseWriter, r *http.Request) {
    collection := client.Database("booksdb").Collection("books")
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

func main() {
    http.HandleFunc("/api/upload", uploadHandler)
    http.HandleFunc("/api/books", getAllBooksHandler)
    http.HandleFunc("/api/health", healthCheckHandler)
    log.Fatal(http.ListenAndServe(":3000", nil))
}
