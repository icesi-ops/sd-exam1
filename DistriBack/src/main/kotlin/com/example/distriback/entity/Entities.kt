package com.example.distriback.entity

import java.io.Serializable
import javax.persistence.*

@Entity
@Table(name = "FILEINFO")
@NamedQuery(name = "Filex.findAll", query = "SELECT f from Filex f")
class Filex(

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "ID", nullable = false)
    var id: Int? = null,
    @Column(name = "NAME")
    var name: String = "",
    @Column(name = "PATH")
    var path: String = "",
    @Column(name = "TYPE")
    var type: String = "",
): Serializable