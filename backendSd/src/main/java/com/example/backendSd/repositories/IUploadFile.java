package com.example.backendSd.repositories;


import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IUploadFile {

    public String uploadFileAzure(MultipartFile file);

}
