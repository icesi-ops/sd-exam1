package com.example.distriback.service

import com.example.distriback.entity.Filex
import com.example.distriback.model.Capacity
import com.example.distriback.model.FileUploaded
import com.example.distriback.model.HostName
import com.example.distriback.repository.FileRepo
import com.microsoft.azure.storage.CloudStorageAccount
import com.microsoft.azure.storage.blob.CloudBlob
import com.microsoft.azure.storage.blob.CloudBlobClient
import com.microsoft.azure.storage.blob.CloudBlobContainer
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.net.InetAddress


@Service
class AppServiceImplementation(val fileRepo: FileRepo) : AppServiceInterface{

    override fun host(): HostName {
        return try {
            HostName(InetAddress.getLocalHost().hostName)
        } catch (E: Exception) {
            System.err.println("System Name Exp : " + E.message)
            HostName("No se puede obtener el nombre del host que responde")
        }
    }

    override fun uploadFile(file: MultipartFile): List<Filex>? {
        var storageConnectionAzure = "DefaultEndpointsProtocol=https;AccountName=bucketmidterm1parcial;AccountKey=MoLX7NX/VxUgwXXLx5aFD26HRP7ON8gGGCH/g9Z5Q5QekEq2Fmj4ik+XPTT5dCfpr16xodlM4I6R+AStnrO9oA==;EndpointSuffix=core.windows.net"
        var nameContainer = "documents"
        try{
            var account: CloudStorageAccount = CloudStorageAccount.parse(storageConnectionAzure)
            var serviceClient : CloudBlobClient = account.createCloudBlobClient()
            var container : CloudBlobContainer = serviceClient.getContainerReference(nameContainer)
            var blob : CloudBlob = container.getBlockBlobReference(file.originalFilename)
            blob.upload(file.inputStream, file.size)
            var filex = Filex(0, file.originalFilename!!, "https://bucketmidterm1.blob.core.windows.net/documents/"+file.originalFilename, file.contentType!!)
            fileRepo.save(filex)
        } catch(e: Exception){
            println(e.message)
        }
        return fileRepo.findAll() as List<Filex>
    }

    override fun capacity(): Capacity {
        var storageConnectionAzure = "DefaultEndpointsProtocol=https;AccountName=bucketmidterm1parcial;AccountKey=MoLX7NX/VxUgwXXLx5aFD26HRP7ON8gGGCH/g9Z5Q5QekEq2Fmj4ik+XPTT5dCfpr16xodlM4I6R+AStnrO9oA==;EndpointSuffix=core.windows.net"
        var nameContainer = "documents"
        var size = 0L
        try{
            var account: CloudStorageAccount = CloudStorageAccount.parse(storageConnectionAzure)
            var serviceClient : CloudBlobClient = account.createCloudBlobClient()
            var container : CloudBlobContainer = serviceClient.getContainerReference(nameContainer)
            val blobItems = container.listBlobs()
            for (blobItem in blobItems) {
                if (blobItem is CloudBlob) {
                    size += blobItem.properties.length
                }
            }
        } catch(e: Exception){
            println(e.message)
        }
        return Capacity(size)
    }

    override fun getFiles(): List<Filex>? {
        return fileRepo.findAll() as List<Filex>
    }
}