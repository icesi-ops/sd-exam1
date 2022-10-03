package com.example.backendSd.services;

import com.example.backendSd.model.FileModel;
import com.example.backendSd.repositories.FileRepositories;
import com.example.backendSd.repositories.IUploadFile;
import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.blob.CloudBlob;
import com.microsoft.azure.storage.blob.CloudBlobClient;
import com.microsoft.azure.storage.blob.CloudBlobContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
//El servicio ejecuta la logica de la aplicacion
@Service
public class FileServices  implements IUploadFile {

    @Autowired
    FileRepositories fileRepositories;

    public ArrayList<FileModel> files(){
        return (ArrayList<FileModel>) fileRepositories.findAll();
    }

    public FileModel saveFile(FileModel file){
        return fileRepositories.save(file);
    }

    @Override
    public String uploadFileAzure(MultipartFile file){

        String resultService = "";
        String storageConnectionAzure="DefaultEndpointsProtocol=https;AccountName=accountfiles1;AccountKey=EWzNYtXFeN2/Nyej32bieuKlpDUylWKV7Fd0SZWI/o6dByPww457sVGA06DVAYD/qwjz7d4UoOl7+AStkjteGQ==;EndpointSuffix=core.windows.net";
        String nameContainer = "files";

        try{

            CloudStorageAccount account = CloudStorageAccount.parse(storageConnectionAzure);
            CloudBlobClient serviceClient = account.createCloudBlobClient();
            CloudBlobContainer  container = serviceClient.getContainerReference(nameContainer);

            CloudBlob blob;
            blob = container.getBlockBlobReference(file.getOriginalFilename());
            blob.upload(file.getInputStream(),file.getSize());

            resultService="OK";
            FileModel obj = new FileModel();
            obj.setNombre(file.getOriginalFilename());
            obj.setType(file.getContentType());
            obj.setPath( "https://accountfiles1.blob.core.windows.net/files/" +file.getOriginalFilename());
            this.saveFile(obj);

        }catch (Exception e){
            resultService = e.getMessage();
        }

        return resultService;
    }


}
