package main

import (
	"context"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// You will be using this Trainer type later in the program
type File struct {
	Id     string
	Nombre string
	Path   string
	Tipo   string
}

type Page struct {
	Title string
	Body  []byte
}

type tp struct {
	Title string
	Body  []string
}

func main() {
	connectToMongo()
	http.HandleFunc("/", uploadHandler)

	log.Fatal(http.ListenAndServe(":80", nil))
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		display(w, "upload", nil)
	case "POST":
		uploadFile(w, r)
	}
}

func getNames() []string {
	var files = getFiles()
	names := make([]string, len(files))

	for i := 0; i < len(files); i++ {
		names[i] = (files[i].Nombre) + "." + (files[i].Tipo)
	}

	return names
}

// Display the named template
func display(w http.ResponseWriter, page string, data interface{}) {
	var files = getNames()

	as := tp{Title: "Saved files: ", Body: files}
	t := template.Must(template.ParseFiles("upload.html"))
	t.Execute(w, as)
}

func uploadFile(w http.ResponseWriter, r *http.Request) {
	// Maximum upload of 10 MB files
	//10 << multiplicar 10 *2, 20 veces
	r.ParseMultipartForm(10 << 20)

	// Get handler for filename, size and headers
	file, handler, err := r.FormFile("myFile")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}

	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	// Create file
	dst, err := os.Create("/mnt/glusterfs/" + handler.Filename)
	defer dst.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Copy the uploaded file to the created file on the filesystem
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	insertFile(handler.Filename)

	http.Redirect(w, r, "https://192.168.33.200", http.StatusSeeOther)

	//display(w, "upload", nil)

}

func connectToMongo() {
	clientOptions := options.Client().ApplyURI("mongodb://192.168.33.100:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

}

func insertFile(name string) {
	clientOptions := options.Client().ApplyURI("mongodb://192.168.33.100:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)
	collection := client.Database("mongo").Collection("files")

	split := strings.Split(name, ".")

	newFile := File{uuid.New().String(), split[0], "/home/vagrant/", split[1]}
	insertResult, err := collection.InsertOne(context.TODO(), newFile)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("File inserted: ", insertResult.InsertedID)

}

func getFiles() []*File {
	clientOptions := options.Client().ApplyURI("mongodb://192.168.33.100:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)
	collection := client.Database("mongo").Collection("files")

	// Pass these options to the Find method
	findOptions := options.Find()

	// Here's an array in which you can store the decoded documents
	var results []*File

	// Passing bson.D{{}} as the filter matches all documents in the collection
	cur, err := collection.Find(context.TODO(), bson.D{{}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(context.TODO()) {

		// create a value into which the single document can be decoded
		var elem File
		err := cur.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}

		results = append(results, &elem)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	// Close the cursor once finished
	cur.Close(context.TODO())

	return results

}
