package main

import (
        "context"
        "fmt"
        "io/ioutil"
        "log"
        "net/http"
        "go.mongodb.org/mongo-driver/bson"
        "go.mongodb.org/mongo-driver/mongo"
        "go.mongodb.org/mongo-driver/mongo/options"
)

// You will be using this Trainer type later in the program
type File struct {
    Id string
    Nombre  string
    Path string
    Tipo string
}

type Page struct {
    Title string
    Body  []byte
}

func main() {
    connectToMongo()
    http.HandleFunc("/", handler)
    log.Fatal(http.ListenAndServe(":80", nil))
    /*http.HandleFunc("/view/", viewHandler)
    http.HandleFunc("/edit/", editHandler)
    http.HandleFunc("/save/", saveHandler)
    log.Fatal(http.ListenAndServe(":8080", nil))*/
}

func handler(w http.ResponseWriter, r *http.Request) {

    fmt.Fprint(w, "Lista de archivos \n",getFiles())
}

func loadPage(title string) (*Page, error) {
    filename := title + ".txt"
    body, err := ioutil.ReadFile(filename)
    if err != nil {
        return nil, err
    }
    return &Page{Title: title, Body: body}, nil
}

func connectToMongo(){
    clientOptions := options.Client().ApplyURI("mongodb://192.168.33.100:27017")
    client, err := mongo.Connect(context.TODO(), clientOptions)

    if err != nil {
        log.Fatal(err)
    }

    err = client.Ping(context.TODO(), nil)

    if err != nil {
        log.Fatal(err)
    }

    //insertFile("test")
}

func (p *Page) save() error {
    filename := p.Title + ".txt"
    return ioutil.WriteFile(filename, p.Body, 0600)
}


/*func editHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/edit/"):]
    p, err := loadPage(title)
    if err != nil {
        p = &Page{Title: title}
    }
    renderTemplate(w, "edit", p)
}

func viewHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/view/"):]
    p, _ := loadPage(title)
    renderTemplate(w, "view", p)
}

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
    t, _ := template.ParseFiles(tmpl + ".html")
    t.Execute(w, p)
}

func saveHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/save/"):]
    body := r.FormValue("body")
    p := &Page{Title: title, Body: []byte(body)}
    p.save()
    http.Redirect(w, r, "/view/"+title, http.StatusFound)
}*/

func insertFile(name string){
   clientOptions := options.Client().ApplyURI("mongodb://192.168.33.100:27017")
   client, err := mongo.Connect(context.TODO(), clientOptions)
   collection := client.Database("mongo").Collection("files")
   newFile :=File{"asdasdasd", name, "home/mongo", ".dll"}
   insertResult, err := collection.InsertOne(context.TODO(), newFile)

   if err != nil {
      log.Fatal(err)
     }

   fmt.Println("File inserted: ", insertResult.InsertedID)

}


func getFiles() string{
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

fmt.Printf("Found multiple documents (array of pointers): %+v\n", results)

return "hola"

}

/*First, before any content is displayed to the user, the web page retrieves information from the store's database.
Then, the template for that store web page is loaded by the shopping cart software.
Finally, the database information obtained in step one is inserted into the template loaded in step two. The resulting HTML code and page content is then rendered in the user's web browser.
*/

