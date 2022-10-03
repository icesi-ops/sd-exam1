package com.example.backendSd.controllers;


//Recibe la peticion Web que imediatamente llama un servicio

import com.example.backendSd.model.FileModel;
import com.example.backendSd.repositories.IUploadFile;
import com.example.backendSd.services.FileServices;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin
public class FileController {

    @Autowired
    FileServices fileServices;

    @Autowired
    IUploadFile iUploadFileService;

    @GetMapping("/getFiles")
    public ArrayList<FileModel> files(){
        return fileServices.files();
    }

    //Cargo archivo en azure y guardo en BD
    @PostMapping("/uploadFile")
    public ResponseEntity<String> uploadFileAzureAcc(@RequestParam("files") MultipartFile[] files){

        Arrays.asList(files).stream().forEach( file ->{
            String resultService = iUploadFileService.uploadFileAzure(file);
        });
        return new ResponseEntity<String>("OK", HttpStatus.OK);
    }

   /* @PostMapping("/upload")
    public String  saveFile(@RequestBody MultipartFile file) throws IOException {

        String response = "";

        if(file == null || file.isEmpty()){
            response ="Por favor Seleccione un archivo";
        }
        //Creamos la ruta donde se va almacenar el archivo
        StringBuilder builder = new StringBuilder();
        builder.append(System.getProperty("user.home"));
        builder.append(File.separator);
        //ruta de la carpeta
        builder.append("Files");
        builder.append(File.separator);
        //Nombre del archivo
        builder.append(file.getOriginalFilename());

        //obtenemos los bytes del archivo que el usuario me esta enviando
        byte[] fileBytes =file.getBytes();
        //obtengo la ruta del archivo
        Path path = Paths.get(builder.toString());
        //Escribimos los bytes del archivo que el usuario subio directamente al nuevo archivo que arme en la ruta
        Files.write(path,fileBytes);
        response="El archivo se cargo correctamente";
        return response;
    }*/


}
