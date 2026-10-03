# Enterprise Workforce Platform

A full-stack internal management system built to handle employee profiles, daily attendance logs, and internal IT service requests.

This project started as a simple Spring Boot CRUD backend to manage employee records[cite: 1, 2, 3, 4, 5, 6]. I later refactored and expanded it into a multi-module system to replicate how production systems handle data validation, relational integrity, state machines, and API contracts.

---

## What It Does

### 1. Employee Management
* Stores and manages employee records (ID, name, email, department, salary)[cite: 2].
* Validates incoming data using DTOs and Jakarta Validation (rejects blank names, malformed emails, and invalid salaries).
* Returns paginated data to prevent loading the entire database into memory.

### 2. Attendance Tracking
* Allows employees to clock in and clock out for the day.
* Enforces a unique constraint (`employee_id` + `work_date`) so an employee cannot clock in twice on the same day.
* Automatically calculates total hours worked on clock-out and flags records as `HALF_DAY` (under 4 hours) or `PRESENT`.

### 3. Internal Service Ticketing
* Lets employees raise support tickets with priority levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
* Implements state transition checks: a ticket must move from `OPEN` to `IN_PROGRESS` before it can be marked as `RESOLVED`.
* Requires resolution notes before closing a resolved issue.

### 4. React Dashboard
* A single-page dashboard built with Vite and React.
* Uses Axios with a central error interceptor to surface backend validation errors cleanly on the screen.

---

## Tech Stack

* **Backend:** Java 17, Spring Boot 3, Spring Data JPA, Hibernate[cite: 3, 6, 7]
* **Database:** MySQL 8
* **Frontend:** React.js, Vite, Axios
* **Testing & Tools:** Postman, Maven, JUnit 5, Mockito

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

# API Summary

## Employees (/api/v1/employees)

POST /api/v1/employees - Register a new employee (validates email, code, salary)

GET /api/v1/employees?page=0&size=10 - Get paginated employee list

GET /api/v1/employees/{id} - Fetch single employee by ID

PUT /api/v1/employees/{id} - Update employee details

DELETE /api/v1/employees/{id} - Remove an employee

## Attendance (/api/v1/attendance)

POST /api/v1/attendance/clock-in - Record today's clock-in

POST /api/v1/attendance/clock-out/{employeeId} - Clock out and calculate worked hours

GET /api/v1/attendance/employee/{employeeId} - View employee attendance logs

## Service Tickets (/api/v1/tickets)

POST /api/v1/tickets - Create an IT/service ticket (OPEN by default)

PATCH /api/v1/tickets/{id}/status - Move status (OPEN -> IN_PROGRESS -> RESOLVED)

GET /api/v1/tickets?status=OPEN - Filter tickets by current status

## Testing & Quality Assurance

1. Backend Unit & Slice Tests
Tested service business logic with Mockito to ensure constraints and state-machine transitions hold true.

Used @WebMvcTest to verify that invalid JSON payloads fail validation and return structured 400 Bad Request messages.

2. Postman Automated Collections
Built a chained test collection with dynamic environment variables (testEmployeeId, testTicketId) to validate the complete employee lifecycle from creation to ticketing.

Tested edge cases including duplicate clock-ins, negative salaries, and illegal ticket state transitions.

3. Database Constraints
Verified schema integrity with composite unique constraints on (employee_id, work_date) to prevent duplicate attendance logs.
