package com.example.distriback.controller

import com.example.distriback.entity.Filex
import com.example.distriback.model.Capacity
import com.example.distriback.model.FileUploaded
import com.example.distriback.model.HostName
import com.example.distriback.service.AppServiceInterface
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@CrossOrigin
class AppControllerImplementation(val appService: AppServiceInterface) : AppControllerInterface{

    @GetMapping("/host")
    override fun host(): HostName {
        return appService.host()
    }

    @PostMapping("/uploadFile")
    override fun uploadFile(@RequestParam("file") file: MultipartFile): List<Filex>? {
        return appService.uploadFile(file)
    }

    @GetMapping("/capacity")
    override fun capacity(): Capacity  {
        return appService.capacity()
    }

    @GetMapping("/getFiles")
    override fun getFiles(): List<Filex>? {
        return appService.getFiles()
    }
}