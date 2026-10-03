# Employee Management System (Spring Boot)

A RESTful Employee Management application built using Spring Boot, Spring Data JPA, and MySQL.  
This project implements full CRUD operations and follows layered architecture best practices.


## 🚀 Features

- Create Employee
- Retrieve All Employees
- Retrieve Employee by ID
- Update Employee Details
- Delete Employee
- RESTful APIs tested using Postman


## 🛠️ Tech Stack

- Java 21
- Spring Boot 3
- Spring Data JPA (Hibernate)
- MySQL
- Maven
- Postman

## 📂 Project Structure

com.lokesh.employeemanagement
├── controller
├── service
├── repository
├── model
└── EmployeeManagementApplication.java


## 📌 API Endpoints

| Method | Endpoint |
|------|---------|
| POST | /employees |
| GET | /employees |
| GET | /employees/{id} |
| PUT | /employees/{id} |
| DELETE | /employees/{id} |


## ▶️ How to Run the Project

### 1️⃣ Prerequisites
- Java 21
- Maven
- MySQL

### 2️⃣ Create Database using sql
CREATE DATABASE employee_db;


### 3️⃣ Configure Database

Update application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/employee_db
spring.datasource.username=root
spring.datasource.password=your_password

### 4️⃣ Run Application
mvn spring-boot:run


### Server runs on:

http://localhost:8081

### 🧪 Testing APIs

All APIs were tested using Postman with JSON request/response bodies.

### 👤 Author

Lokeshkumar 
Java & Spring Boot Developer
