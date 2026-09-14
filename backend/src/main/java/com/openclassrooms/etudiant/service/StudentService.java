package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.mapper.StudentDtoMapper;
import com.openclassrooms.etudiant.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentDtoMapper studentDtoMapper;

    public StudentResponseDTO createStudent(StudentRequestDTO studentRequestDTO) {
        Student student = studentDtoMapper.toEntity(studentRequestDTO);
        Student savedStudent = studentRepository.save(student);

        return studentDtoMapper.toResponseDTO(savedStudent);
    }

    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(studentDtoMapper::toResponseDTO)
                .toList();
    }

    public StudentResponseDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Student with id " + id + " not found"
                ));

        return studentDtoMapper.toResponseDTO(student);
    }

    public StudentResponseDTO updateStudent(
            Long id,
            StudentRequestDTO studentRequestDTO) {

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Student with id " + id + " not found"
                ));

        existingStudent.setFirstName(studentRequestDTO.getFirstName());
        existingStudent.setLastName(studentRequestDTO.getLastName());

        Student updatedStudent = studentRepository.save(existingStudent);

        return studentDtoMapper.toResponseDTO(updatedStudent);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Student with id " + id + " not found"
                ));

        studentRepository.delete(student);
    }
}