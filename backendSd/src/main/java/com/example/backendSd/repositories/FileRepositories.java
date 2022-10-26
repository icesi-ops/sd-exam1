package com.example.backendSd.repositories;


import com.example.backendSd.model.FileModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

//Este realiza la conexion con la BD y el repositorio a su ves utilzia el modelo
@Repository
public interface FileRepositories extends CrudRepository<FileModel,Long> {



}
