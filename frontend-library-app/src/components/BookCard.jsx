import React, { useState, useEffect } from 'react';
import { IconButton, Card, CardContent, Typography, CardActions, Modal, Box, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import axios from 'axios';

const backend = import.meta.env.VITE_BACKEND;

const BookCard = ({ book, onUpdate, onDelete }) => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatedBook, setUpdatedBook] = useState({ ...book });
    const [bookImage, setBookImage] = useState('');
    

    const handleUpdateBook = async () => {
        try {
            // Si existe un archivo de imagen seleccionado, subirlo al endpoint de Image
            if (updatedBook.file) {
                const formData = new FormData();
                formData.append('file', updatedBook.file);
                const oldImage = book.image.split('/')[7].split('?')[0].split('%2F')[1]
                console.log(oldImage)
                const response = await axios.put(`${backend}/api/Image/${oldImage}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                // Obtener la URL de la imagen actualizada
                console.log(response.data)
                const imageUrl = response.data;
                const formattedNewBook = {
                    id: updatedBook.id,
                    title: updatedBook.title,
                    author: updatedBook.author,
                    created: updatedBook.created,
                    image: imageUrl
                };

                setUpdatedBook({ ...updatedBook, image: imageUrl });
                console.log(updatedBook)
                
                await axios.put(`${backend}/api/Book/${updatedBook.id}`, formattedNewBook);
                // Actualizar el estado con la nueva URL de la imagen
                
            }else{
                await axios.put(`${backend}/api/Book/${updatedBook.id}`, updatedBook);
            }
    
            // Enviar la solicitud de actualización del libro al backend
            
    
            // Cerrar el modal después de la actualización y actualizar los libros
            setShowUpdateModal(false);
            onUpdate(); // Actualizar la lista de libros
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };
    

    const handleDeleteBook = async () => {
        try {
            const newImage = book.image.split('/')[7].split('?')[0].split('%2F')[1]
            console.log(newImage)
            await axios.delete(`${backend}/api/Image/${newImage}`);
            await axios.delete(`${backend}/api/Book/${book.id}`);
            onDelete(book.id);
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedBook({ ...updatedBook, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setUpdatedBook({ ...updatedBook, file });
    };



    return (
        <Card>
            <img src={book.image} alt={book.title} style={{ width: '100%' }} />
            <CardContent>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', fontSize: 18 }}>
                    {book.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Author:</strong> {book.author}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Published:</strong> {book.created}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton aria-label="update" onClick={() => setShowUpdateModal(true)} sx={{ color: 'orange' }}>
                    <ChangeCircleIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={handleDeleteBook} sx={{ color: 'red' }}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>

            {/* Modal para actualizar información del libro */}
            <Modal open={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, width: 400, maxWidth: '90%' }}>
                    <Typography variant="h6" gutterBottom>Actualizar libro</Typography>
                    <TextField name="title" label="Título" fullWidth value={updatedBook.title} onChange={handleChange} />
                    <TextField name="author" label="Autor" fullWidth value={updatedBook.author} onChange={handleChange} />
                    <TextField name="created" label="Fecha de creación" fullWidth value={updatedBook.created} onChange={handleChange} />
                    <input type="file" name="file" onChange={handleFileChange} />
                    <Button onClick={handleUpdateBook} variant="contained" sx={{ mt: 2 }}>Guardar</Button>
                </Box>
            </Modal>
        </Card>
    );
};

export default BookCard;
