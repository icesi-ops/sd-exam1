package com.example.distriback.repository

import com.example.distriback.entity.Filex
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface FileRepo : CrudRepository<Filex, Long> {
}