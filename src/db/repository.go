package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"
)

var (
	// FIX THIS VARIABLES FOR ENV VARS INSTEAD TO
	// cockroachAddress      = "root@localhost:26257"
	cockroachAddress      = os.Getenv("DBADDRESS")
	cockroachDatabaseName = "files"
)

type repo struct {
	db *sql.DB
}

type RepoI interface {
	CreateFile(File) error
	FetchFiles() ([]File, error)
}

type File struct {
	ID        string    `json:"ID"`
	Path      string    `json:"path"`
	MimeType  string    `json:"mimetype"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}

func NewConection(addr, db string) (*sql.DB, error) {
	return sql.Open("postgres", fmt.Sprintf("postgresql://%s/%s?sslmode=disable", addr, db))
}

func NewRepository() RepoI {
	conn, err := NewConection(cockroachAddress, cockroachDatabaseName)
	if err != nil {
		log.Fatal(err)
	}

	r := repo{db: conn}

	// remove this after debugging
	r.createFilesTable()

	return r
}

func (r repo) CreateFile(file File) error {
	query := `INSERT INTO files (id, path, mimetype, created_at) VALUES ($1, $2, $3, $4)`

	_, err := r.db.Exec(query, file.ID, file.Path, file.MimeType, file.CreatedAt)
	if err != nil {
		return err
	}

	return nil
}

func (r repo) FetchFiles() ([]File, error) {
	query := `SELECT id, path, mimetype, created_at FROM files`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	var files []File

	for rows.Next() {
		var f File

		if err := rows.Scan(&f.ID, &f.Path, &f.MimeType, &f.CreatedAt); err != nil {
			log.Println(err)
			continue
		}

		files = append(files, f)
	}

	return files, nil
}

func (r repo) createFilesTable() error {
	if _, err := r.db.Exec(
		"CREATE TABLE IF NOT EXISTS files (id STRING, path STRING, mimetype STRING, created_at TIMESTAMPTZ), SET database=files"); err != nil {
		log.Fatal(err)
	}

	return nil
}
