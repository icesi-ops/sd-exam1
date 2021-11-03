package handler

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"time"

	_ "github.com/lib/pq"
	db "github.com/nonsenseguy/sd-exam1/db"
)

type Handler struct {
	repo db.RepoI
}

func NewHandler() *Handler {
	return &Handler{
		repo: db.NewRepository(),
	}
}

func (h *Handler) UploadFilesHandler(res http.ResponseWriter, req *http.Request) {
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

	err = ioutil.WriteFile(handler.Filename, fileBytes, 0o644)
	if err != nil {
		log.Println(fmt.Errorf("error writing file in server: %w", err))
		return
	}

	log.Print("file saved in server")
	err = h.saveFileRegister(handler)
	if err != nil {
		log.Println(fmt.Errorf("error saving register to db: %w", err))
		return
	}

	fmt.Fprintf(res, "Succesfully uploaded file")
}

func (h *Handler) FetchFilesHandler(res http.ResponseWriter, req *http.Request) {
  files, err := h.repo.FetchFiles()
  if err != nil {
    log.Println(fmt.Errorf("error fetching files: %w", err))
    return
  }

  json.NewEncoder(res).Encode(files)
}

// FIX MIMETYPE
func (h *Handler) saveFileRegister(handler *multipart.FileHeader) error {
	file := db.File{
		ID:        generateUUID(),
		Path:      handler.Filename,
		MimeType:  "dummy",
		CreatedAt: time.Now(),
	}

	err := h.repo.CreateFile(file)
	if err != nil {
		return err
	}

	return nil
}

func generateUUID() string {
	b := make([]byte, 10)
	if _, err := rand.Read(b); err != nil {
		log.Println("error generating uuid")
		log.Panic(err)
	}

	return fmt.Sprintf("%X", b)
}
