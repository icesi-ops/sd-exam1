// handleAddBook maneja la solicitud para agregar un nuevo libro
func handleAddBook(w http.ResponseWriter, r *http.Request) {
    var book Book
    err := json.NewDecoder(r.Body).Decode(&book)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    books = append(books, book)
    fmt.Fprintf(w, "Libro '%s' agregado correctamente", book.Title)
}

// handleListBooks maneja la solicitud para listar todos los libros
func handleListBooks(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(books)
}

// handleHealthCheck maneja la solicitud de comprobación de salud del sistema
func handleHealthCheck(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Sistema en funcionamiento")
}

func main() {
    // Endpoints
    http.HandleFunc("/add_book", handleAddBook)
    http.HandleFunc("/list_books", handleListBooks)
    http.HandleFunc("/health", handleHealthCheck)

    // Servidor
    fmt.Println("Servidor en funcionamiento en el puerto :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}