package com.openclassrooms.etudiant.mapper;

import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StudentDtoMapper {

    Student toEntity(StudentRequestDTO studentRequestDTO);

    StudentResponseDTO toResponseDTO(Student student);
}