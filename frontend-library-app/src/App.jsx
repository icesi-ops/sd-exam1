import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, Modal, Box, TextField, Typography } from '@mui/material';
import axios from 'axios';
import BookCard from './components/BookCard';


const backend = import.meta.env.VITE_BACKEND;

const App = () => {
    const [books, setBooks] = useState([]);
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [newBook, setNewBook] = useState({});
    const [newBookImage, setNewBookImage] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${backend}/api/Book`);
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    const handleAddBook = async () => {

        // Si hay una imagen seleccionada, la subimos al backend
        if (newBookImage) {
            const formData = new FormData();
            formData.append('file', newBookImage);

            const urlImage = await axios.post(`${backend}/api/Image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Url de la imagen: ', urlImage);
            try {
                const formattedNewBook = {
                    id: 0,
                    title: newBook.title,
                    author: newBook.author,
                    created: newBook.created,
                    image: urlImage.data
                };

                // Primero, enviamos el libro al backend sin la imagen
                await axios.post(`${backend}/api/Book`, formattedNewBook);

                // Después de subir el libro y la imagen (si existe), actualizamos la lista de libros
                const response = await axios.get(`${backend}/api/Book`);
                setBooks(response.data);

                // Limpiamos los estados
                setShowAddBookModal(false);
                setNewBook({});
                setNewBookImage(null);
            } catch (error) {
                console.error('Error adding book:', error);
            }
        }




    };

    const handleUpdateBook = async () => {
        try {
            const response = await axios.get(`${backend}/api/Book`);
            setBooks(response.data);
        } catch (error) {
            console.error('Error updating books:', error);
        }
    };

    const handleDeleteBook = async (id) => {
        try {
            const response = await axios.get(`${backend}/api/Book`);
            setBooks(response.data);
        } catch (error) {
            console.error('Error deleting books:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewBook({ ...newBook, [name]: value });
    };

    return (
        <Container>
            <Typography variant="h3" align="center" gutterBottom>
                Library APP
            </Typography>
            <Typography variant="h5" align="center" gutterBottom>
                ¡Agrega libros para expandir tu biblioteca!
            </Typography>
            <Button onClick={() => setShowAddBookModal(true)} variant="contained" color="success" size="large" sx={{ display: 'block', margin: 'auto' }}>
                Agregar libro
            </Button>
            <Modal open={showAddBookModal} onClose={() => setShowAddBookModal(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, width: 500, maxWidth: '90%' }}>
                    <Typography variant="h6" gutterBottom>Agregar libro</Typography>
                    <TextField name="title" label="Título" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
                    <TextField name="author" label="Autor" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
                    <TextField name="created" label="Fecha de creación" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={8}>
                            <TextField
                                type="file"
                                name="imageFile"
                                fullWidth
                                onChange={(event) => setNewBookImage(event.target.files[0])}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body1" sx={{ pl: 1 }}>{newBookImage ? newBookImage.name : 'Ningún archivo seleccionado'}</Typography>
                        </Grid>
                    </Grid>
                    <Button onClick={handleAddBook} variant="contained" sx={{ mt: 2 }}>Agregar</Button>
                </Box>
            </Modal>

            <Grid container spacing={3} sx={{ marginTop: 4 }}>
                {Array.isArray(books) ? books.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.id}>
                        <BookCard book={book} onUpdate={handleUpdateBook} onDelete={handleDeleteBook} />
                    </Grid>
                )) : <></>}
            </Grid>
        </Container>
    );
};

export default App;