package com.example.backendSd.repositories;


import com.example.backendSd.model.Response;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IUploadFile {

    public String uploadFileAzure(MultipartFile file);

    public long Storage();

    public String Host();
}
