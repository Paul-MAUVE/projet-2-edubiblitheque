package com.openclassrooms.etudiant.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.StudentRepository;
import com.openclassrooms.etudiant.repository.UserRepository;
import com.openclassrooms.etudiant.service.StudentService;
import com.openclassrooms.etudiant.service.UserService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
public class StudentControllerTest {

    private static final String FIRST_NAME = "John";
    private static final String LAST_NAME = "Doe";
    private static final String LOGIN = "login";
    private static final String PASSWORD = "password";
    private String jwtToken;
    private StudentResponseDTO studentResponseDTO;
    private StudentRequestDTO studentRequestDTO = new StudentRequestDTO();
    
    @Container
    static MySQLContainer mySQLContainer = new MySQLContainer("mysql:8.0.33");

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentService studentService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MockMvc mockMvc;  
    

    @DynamicPropertySource
    static void configureTestProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> mySQLContainer.getJdbcUrl());
        registry.add("spring.datasource.username", () -> mySQLContainer.getUsername());
        registry.add("spring.datasource.password", () -> mySQLContainer.getPassword());
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create");
    }
    
    @BeforeEach
    public void setUp() throws Exception {
        User user = new User();
        user.setFirstName(FIRST_NAME);
        user.setLastName(LAST_NAME);
        user.setLogin(LOGIN);
        user.setPassword(PASSWORD);
        
        userService.register(user);
        jwtToken = userService.login(LOGIN, PASSWORD);

        studentRequestDTO.setFirstName(FIRST_NAME);
        studentRequestDTO.setLastName(LAST_NAME);

        studentResponseDTO = studentService.createStudent(studentRequestDTO);
    }

    @AfterEach
    public void afterEach() {
        studentRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void createStudent() throws Exception {
        //GIVEN
        StudentRequestDTO newStudentRequestDTO = new StudentRequestDTO();
        newStudentRequestDTO.setFirstName("Jane");
        newStudentRequestDTO.setLastName("FOSTER");

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/students")
                    .content(objectMapper.writeValueAsString(newStudentRequestDTO))
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + jwtToken))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Test
    public void getAllStudents() throws Exception {
        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/students")
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + jwtToken))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void getStudentById() throws Exception {
        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/students/" + studentResponseDTO.getId())
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + jwtToken))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void updateStudent() throws Exception {
        //GIVEN
        studentRequestDTO.setFirstName("New");
        studentRequestDTO.setLastName("NAME");
        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/students/" + studentResponseDTO.getId())
                    .content(objectMapper.writeValueAsString(studentRequestDTO))
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + jwtToken))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void deleteStudent() throws Exception {
        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/students/" + studentResponseDTO.getId())
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + jwtToken))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
