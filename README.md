## Introduction

The Library Management System is a web application designed to manage library operations efficiently. It allows users to sign up, log in, and manage book issues. Admins have additional privileges to manage library records and user information.

## Features

- User Authentication and Authorization
- Admin and User Roles
- Book Issue Management
- Secure Password Handling
- Responsive User Interface

 ## Technologies Used

- Backend: Node.js, Express.js
- Frontend: EJS (Embedded JavaScript templates)
- Database: Firebase Firestore
- Authentication: Firebase Authentication, password-hash
- Others: Axios, body-parser
  
## User Interaction

### 1. Home Page
- Displays a dashboard with navigation options.

### 2. User Signup
- Form to register a new user or admin.
- Validation to check if the email already exists.

### 3. User Login
- Form to log in as a user with email and registration number.
- Password verification and redirection to user home page upon success.

### 4. Admin Login
- Form to log in as an admin with email and admin ID.
- Password verification and redirection to admin home page upon success.

### 5. Book Issue
- Form for users to issue books by providing book name, issue date, account number, and call number.
- Confirmation and redirection to a success page.
