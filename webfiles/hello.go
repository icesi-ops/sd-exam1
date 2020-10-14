package main

import (
	"database/sql"
	"fmt"

	"github.com/gin-contrib/cors"
	_ "github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var database *sql.DB

const (
	host     = "192.168.50.13"
	port     = 5432
	user     = "remote"
	password = "remote"
	dbname   = "pg_ds"
)

//Cellphone struct
type Cellphone struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Brand    string `json:"brand"`
	Capacity int    `json:"capacity"`
}

type body1 struct {
	Name string
}

func getAll(ctx *gin.Context) {
	fmt.Println(" Puto GO antes")
	fmt.Println(database)
	rows, err := database.Query("select * from cellphones")
	if err != nil {
		fmt.Println(" Puto GO")
		fmt.Println(err.Error())
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	array := []Cellphone{}

	var id int
	var name string
	var brand string
	var capacity int

	for rows.Next() {
		rows.Scan(&id, &name, &brand, &capacity)
		fmt.Println(id, name)
		array = append(array, Cellphone{id, name, brand, capacity})
		fmt.Println(array)
	}
	fmt.Println(array)
	ctx.JSON(200, gin.H{"array": &array})
}

func getByName(ctx *gin.Context) {
	namesearch := ctx.Param("name")
	fmt.Println(namesearch)

	rows, err := database.Query("SELECT * from CELLPHONES where name like '%" + namesearch + "%'")
	fmt.Println(err)

	array := []Cellphone{}

	var id int
	var name string
	var brand string
	var capacity int

	for rows.Next() {
		rows.Scan(&id, &name, &brand, &capacity)
		fmt.Println(id, name)
		array = append(array, Cellphone{id, name, brand, capacity})
		fmt.Println(array)
	}
	fmt.Println(array)
	ctx.JSON(200, gin.H{"array": &array})
}

func main() {

	// url := fmt.Sprintf("host=%s port=%d user=%s "+
	// 	"password=%s dbname=%s sslmode=disable",
	// 	host, port, user, password, dbname)
	url := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=disable",
		user, password, host, port, dbname)
	var err error
	database, err = sql.Open("postgres", url)
	if err != nil {
		fmt.Println(err)
	}
	defer database.Close()

	err = database.Ping()
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("Successfully connected!")

	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/ping", getAll)
	r.GET("/byName/:name", getByName)

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
