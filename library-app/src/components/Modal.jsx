import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input} from "@nextui-org/react";
import FileChooser from './FileChooser';

const BooksModal = ({isOpen, onClose}) => {
    const [book, setBook] = React.useState({
        name: '',
        year: '',
        file: undefined
    })

    const handleInputChange = (e) => {
        setBook({...book, [e.target.name]: e.target.value})
    }

    const handleFileSelected = (file) => {
        setBook({...book, file})
      };

    const handleSave = () => {
        const {file, ...rest} = book;
        const data = new FormData();
        console.log('Book:', book);
        data.append('file', file);
        data.append('json', JSON.stringify(rest));
        console.log('Form data:', data);
        fetch('your_upload_url', { //backend url endpoint http://localhost:5000/upload
            method: 'POST',
            body: data,
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('File uploaded successfully:', data);
            alert('File uploaded successfully');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('There was a problem with the fetch operation');
        });
      }


  return (
    <Modal  size={'2xl'}  isOpen={isOpen}  onClose={onClose}  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Create new Book</ModalHeader>
          <ModalBody>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 items-center">
                <Input type="text" label="Name" name='name' value={book.name} onChange={handleInputChange}/>
                <Input type="number" label="Year" placeholder="Enter publication year" name='year' value={book.year} onChange={handleInputChange}/>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 items-center justify-center mt-2">
                <FileChooser onFileSelected={handleFileSelected}/>
                <h6>{book?.file?.name}</h6>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={onClose} onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
  )
}

export default BooksModal