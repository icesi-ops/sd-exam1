package com.example.backendSd.services;

import com.example.backendSd.model.FileModel;
import com.example.backendSd.model.Response;
import com.example.backendSd.repositories.FileRepositories;
import com.example.backendSd.repositories.IUploadFile;
import com.google.gson.Gson;
import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.blob.CloudBlob;
import com.microsoft.azure.storage.blob.CloudBlobClient;
import com.microsoft.azure.storage.blob.CloudBlobContainer;
import com.microsoft.azure.storage.blob.ListBlobItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.InetAddress;
import java.net.UnknownHostException;
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
       // String storageConnectionAzure="DefaultEndpointsProtocol=https;AccountName=accountfiles1;AccountKey=EWzNYtXFeN2/Nyej32bieuKlpDUylWKV7Fd0SZWI/o6dByPww457sVGA06DVAYD/qwjz7d4UoOl7+AStkjteGQ==;EndpointSuffix=core.windows.net";
        String storageConnectionAzure ="DefaultEndpointsProtocol=https;AccountName=storageaja;AccountKey=E6DrvFrj3IE8n0eF3hl5QuZmX0YfRxcQyanHbX9c7Exdq2aMIBMvkWFWe18gjAKCZqQZvwykHpif+AStlK4JDQ==;EndpointSuffix=core.windows.net";
        String nameContainer = "files";

        try{

            CloudStorageAccount account = CloudStorageAccount.parse(storageConnectionAzure);
            CloudBlobClient serviceClient = account.createCloudBlobClient();
            CloudBlobContainer  container = serviceClient.getContainerReference(nameContainer);

            CloudBlob blob;


            blob = container.getBlockBlobReference(file.getOriginalFilename());
            blob.upload(file.getInputStream(),file.getSize());
            System.out.println("Host blob:  "+blob.getUri().getHost());

            resultService="OK";
            FileModel obj = new FileModel();
            obj.setNombre(file.getOriginalFilename());
            obj.setType(file.getContentType());
            obj.setPath( "https://accountfiles1.blob.core.windows.net/files/" +file.getOriginalFilename());
            this.saveFile(obj);


            long size = 0;
            Iterable<ListBlobItem> blobItems = container.listBlobs();
            for (ListBlobItem blobItem : blobItems) {
                if (blobItem instanceof CloudBlob) {
                    CloudBlob blob2 = (CloudBlob) blobItem;
                    size += blob2.getProperties().getLength();
                }
            }


        }catch (Exception e){
            resultService = e.getMessage();
        }

        return resultService;
    }

    @Override
    public long Storage() {

        String storageConnectionAzure ="DefaultEndpointsProtocol=https;AccountName=storageaja;AccountKey=E6DrvFrj3IE8n0eF3hl5QuZmX0YfRxcQyanHbX9c7Exdq2aMIBMvkWFWe18gjAKCZqQZvwykHpif+AStlK4JDQ==;EndpointSuffix=core.windows.net";
        String nameContainer = "files";

        long size =0;
        try {
            CloudStorageAccount  account = CloudStorageAccount.parse(storageConnectionAzure);
            CloudBlobClient serviceClient = account.createCloudBlobClient();
            CloudBlobContainer  container = serviceClient.getContainerReference(nameContainer);

            Iterable<ListBlobItem> blobItems = container.listBlobs();
            for (ListBlobItem blobItem : blobItems) {
                if (blobItem instanceof CloudBlob) {
                    CloudBlob blob2 = (CloudBlob) blobItem;
                    size += blob2.getProperties().getLength();
                }
            }
        }catch (Exception e){
            String  resultService = e.getMessage();
        }

        return size;
    }

    @Override
    public String Host() {
        String hostname="";

        Gson json = new Gson();
        Response response = new Response();
        String respuesta="";
        try {
            hostname = InetAddress.getLocalHost().getHostName();
            response.setResponse(hostname);
            respuesta = json.toJson(response);

        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        return respuesta;
    }


}
