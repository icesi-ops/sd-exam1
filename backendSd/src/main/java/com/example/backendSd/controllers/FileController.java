package com.example.backendSd.controllers;


//Recibe la peticion Web que imediatamente llama un servicio

import com.example.backendSd.model.FileModel;
import com.example.backendSd.model.Response;
import com.example.backendSd.repositories.IUploadFile;
import com.example.backendSd.services.FileServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.Arrays;

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

    @GetMapping("/storage")
    public long storage (){
        return iUploadFileService.Storage();
    }

    @GetMapping("/host")
    public String hostname (){
        return iUploadFileService.Host();
    }

    @PostMapping("/uploadFile")
    public ResponseEntity<String> uploadFileAzureAcc(@RequestParam("files") MultipartFile[] files){

        Arrays.asList(files).stream().forEach( file ->{
            String resultService = iUploadFileService.uploadFileAzure(file);
        });
        return new ResponseEntity<String>("OK", HttpStatus.OK);
    }

}
