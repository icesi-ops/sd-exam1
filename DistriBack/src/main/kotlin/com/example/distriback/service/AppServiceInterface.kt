package com.example.distriback.service

import com.example.distriback.entity.Filex
import com.example.distriback.model.Capacity
import com.example.distriback.model.FileUploaded
import com.example.distriback.model.HostName
import org.springframework.web.multipart.MultipartFile

interface AppServiceInterface {

    fun host(): HostName
    fun uploadFile(file: MultipartFile): List<Filex>?
    fun capacity(): Capacity
    fun getFiles(): List<Filex>?
}