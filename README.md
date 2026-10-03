# Enterprise Workforce Platform

A full-stack internal management system built to handle employee profiles, daily attendance logs, and internal IT service requests.

This project started as a simple Spring Boot CRUD backend to manage employee records. I later refactored and expanded it into a multi-module system to replicate how production systems handle data validation, relational integrity, state machines, and API contracts.

---

## What It Does

1. **Employee Management**
   - Stores and manages employee records (ID, name, email, department, salary).
   - Validates incoming data using DTOs and Jakarta Validation (rejects blank names, malformed emails, and invalid salaries).
   - Returns paginated data to prevent loading the entire database into memory.

2. **Attendance Tracking**
   - Allows employees to clock in and clock out for the day.
   - Enforces a unique constraint (`employee_id` + `work_date`) so an employee cannot clock in twice on the same day.
   - Automatically calculates total hours worked on clock-out and flags records as `HALF_DAY` (under 4 hours) or `PRESENT`.

3. **Internal Service Ticketing**
   - Lets employees raise support tickets with priority levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
   - Implements state transition checks: a ticket must move from `OPEN` to `IN_PROGRESS` before it can be marked as `RESOLVED`.
   - Requires resolution notes before closing a resolved issue.

4. **React Dashboard**
   - A single-page dashboard built with Vite and React.
   - Uses Axios with a central error interceptor to surface backend validation errors cleanly on the screen.

---

## Tech Stack

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, Hibernate
- **Database:** MySQL 8
- **Frontend:** React.js, Vite, Axios
- **Testing & Tools:** Postman, Maven, JUnit 5, Mockito

---

## Project Structure

```text
├── backend/
│   ├── src/main/java/com/lokesh/employeemanagement/
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Request & Response records with validation rules
│   │   ├── exception/       # Global exception handler & custom exceptions
│   │   ├── model/           # JPA entities & Enums
│   │   ├── repository/      # Spring Data JPA repositories
│   │   └── service/         # Core business logic & state checks
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance & domain API calls
│   │   ├── components/      # UI components (Employees, Attendance, Tickets)
│   │   └── App.jsx
│   └── package.json
└── README.md

Getting Started
Prerequisites
JDK 17 or higher installed

Node.js (v18+) and npm

MySQL running locally

Step 1: Database Setup
Log into your local MySQL instance and create the database:

SQL
CREATE DATABASE employee_db;
Update your database credentials in backend/src/main/resources/application.properties if they differ:

Properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
server.port=8081
Step 2: Run the Spring Boot Backend
From the backend folder:

Bash
# Build the project
mvn clean install

# Run the app
mvn spring-boot:run
The backend starts at http://localhost:8081.

To run the unit and controller tests:

Bash
mvn test
Step 3: Run the React Frontend
Open a new terminal, navigate to the frontend folder:

Bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
Open http://localhost:5173 in your browser.

API Summary
Employees (/api/v1/employees)
POST /api/v1/employees - Register a new employee (validates email, code, salary)

GET /api/v1/employees?page=0&size=10 - Get paginated employee list

GET /api/v1/employees/{id} - Fetch single employee by ID

PUT /api/v1/employees/{id} - Update employee details

DELETE /api/v1/employees/{id} - Remove an employee

Attendance (/api/v1/attendance)
POST /api/v1/attendance/clock-in - Record today's clock-in

POST /api/v1/attendance/clock-out/{employeeId} - Clock out and calculate worked hours

GET /api/v1/attendance/employee/{employeeId} - View employee attendance logs

Service Tickets (/api/v1/tickets)
POST /api/v1/tickets - Create an IT/service ticket (OPEN by default)

PATCH /api/v1/tickets/{id}/status - Move status (OPEN -> IN_PROGRESS -> RESOLVED)

GET /api/v1/tickets?status=OPEN - Filter tickets by current status

How I Tested It
Backend Unit & Slice Tests: Wrote tests using Mockito and @WebMvcTest to verify that invalid inputs return 400 Bad Request and that tickets cannot jump states without resolving notes.

Postman Automation: Set up a sequential Postman collection using collection variables so the ID generated in POST /employees automatically feeds into the attendance and ticketing requests.

Database Checks: Verified composite unique constraints in MySQL by attempting duplicate clock-ins and confirming MySQL blocks redundant daily logs.
