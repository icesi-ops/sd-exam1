package handler

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

func UploadFilesHandler(res http.ResponseWriter, req *http.Request) {
	file, handler, err := req.FormFile("file")
	if err != nil {
    log.Println(fmt.Errorf("error retrieving file: %w", err))
		return
	}

	defer file.Close()
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		log.Println(fmt.Errorf("error reading file: %w", err))
    return
	}

	err = ioutil.WriteFile(handler.Filename, fileBytes, 0644)
  if err != nil {
    log.Println(fmt.Errorf("error writing file in server: %w", err))
    return
  }

  fmt.Fprintf(res, "Succesfully uploaded file")
}
