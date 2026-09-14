package com.openclassrooms.etudiant.service;
import com.openclassrooms.etudiant.mapper.StudentDtoMapper;
import com.openclassrooms.etudiant.repository.StudentRepository;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.junit.jupiter.api.extension.ExtendWith;
import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;
import java.util.List;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class StudentServiceTest {

    private static final String FIRST_NAME = "John";
    private static final String LAST_NAME = "Doe";
    private static final long ID = 1;
    
    @Mock
    private StudentRepository studentRepository;

    @Mock
    private StudentDtoMapper studentDtoMapper;

    @InjectMocks
    private StudentService studentService;

    @Test
    void createStudent() {

        // GIVEN
        StudentRequestDTO requestDTO = new StudentRequestDTO();
        requestDTO.setFirstName(FIRST_NAME);
        requestDTO.setLastName(LAST_NAME);

        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);

        Student savedStudent = new Student();
        savedStudent.setFirstName(FIRST_NAME);
        savedStudent.setLastName(LAST_NAME);

        StudentResponseDTO responseDTO = new StudentResponseDTO();
        responseDTO.setFirstName(FIRST_NAME);
        responseDTO.setLastName(LAST_NAME);

        // Simulation du comportement du mapper et du repository
        when(studentDtoMapper.toEntity(requestDTO)).thenReturn(student);
        when(studentRepository.save(student)).thenReturn(savedStudent);
        when(studentDtoMapper.toResponseDTO(savedStudent)).thenReturn(responseDTO);

        // WHEN
        StudentResponseDTO result = studentService.createStudent(requestDTO);

        // THEN
        assertEquals(responseDTO, result);
    }

    @Test
    void getAllStudents() {

        // GIVEN
        Student student1 = new Student();
        student1.setFirstName(FIRST_NAME);
        student1.setLastName(LAST_NAME);

        Student student2 = new Student();
        student2.setFirstName("Jane");
        student2.setLastName("FOSTER");

        // Préparation des DTO correspondant aux étudiants
        StudentResponseDTO responseDTO1 = new StudentResponseDTO();
        responseDTO1.setFirstName(FIRST_NAME);
        responseDTO1.setLastName(LAST_NAME);

        StudentResponseDTO responseDTO2 = new StudentResponseDTO();
        responseDTO2.setFirstName("Jane");
        responseDTO2.setLastName("FOSTER");

        // Simulation de la liste retournée par le repository
        when(studentRepository.findAll())
                .thenReturn(List.of(student1, student2));

        // Simulation de la conversion des étudiants en DTO
        when(studentDtoMapper.toResponseDTO(student1))
                .thenReturn(responseDTO1);

        when(studentDtoMapper.toResponseDTO(student2))
                .thenReturn(responseDTO2);

        // WHEN
        List<StudentResponseDTO> result = studentService.getAllStudents();

        // THEN
        assertEquals(List.of(responseDTO1, responseDTO2), result);
    }
    
    @Test
    void getStudentById() {
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
    
        StudentResponseDTO responseDTO = new StudentResponseDTO();
        responseDTO.setFirstName(FIRST_NAME);
        responseDTO.setLastName(LAST_NAME);

        // Simulation du repository qui retrouve l'étudiant
        when(studentRepository.findById(ID))
        .thenReturn(Optional.of(student));

        // Simulation de la conversion de l'étudiant en DTO
        when(studentDtoMapper.toResponseDTO(student))
        .thenReturn(responseDTO);

        // WHEN
        StudentResponseDTO result = studentService.getStudentById(ID);

        // THEN
        assertEquals(responseDTO, result);
    }

    @Test
    void updatedStudent(){
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);

        // Préparation du résultat attendu après la modification
        StudentResponseDTO responseDTO = new StudentResponseDTO();
        responseDTO.setFirstName("Pomme");
        responseDTO.setLastName("Done");

        // Préparation des nouvelles données à appliquer à l'étudiant
        StudentRequestDTO requestDTO = new StudentRequestDTO();
        requestDTO.setFirstName("Pomme");
        requestDTO.setLastName("Done");

        // Simulation de la récupération de l'étudiant existant
        when(studentRepository.findById(ID))
        .thenReturn(Optional.of(student));


        // Simulation de l'enregistrement de l'étudiant modifié
        when(studentRepository.save(student))
        .thenReturn(student);

        // Simulation de la conversion de l'étudiant modifié en DTO de réponse
        when(studentDtoMapper.toResponseDTO(student))
        .thenReturn(responseDTO);

        // WHEN
        StudentResponseDTO result = studentService.updateStudent(ID, requestDTO);

        // THEN
        assertEquals(responseDTO, result);
    }

    @Test
    void deleteStudent(){
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);

        // Simulation de la récupération de l'étudiant existant
        when(studentRepository.findById(ID))
        .thenReturn(Optional.of(student));

        // WHEN
        studentService.deleteStudent(ID);

        // THEN
        verify(studentRepository).delete(student);
    }
}
