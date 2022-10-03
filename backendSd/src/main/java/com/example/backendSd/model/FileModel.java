package com.example.backendSd.model;


import jdk.jfr.DataAmount;

import javax.persistence.*;

@Entity
@Table(name="files")
public class FileModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(unique = true,nullable = false)
    private Long id;


    private String nombre;

    private String path;
    private String type;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

}
