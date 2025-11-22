# Account Management Capability

## ADDED Requirements

### Requirement: Account Creation
The system SHALL allow users to create new accounts with unique usernames and secure passwords.

#### Scenario: Successful account creation
- **WHEN** a user provides valid username, password, and email
- **THEN** the system creates an account record in the database
- **AND** the password is hashed using bcrypt or argon2
- **AND** the user receives a confirmation message

#### Scenario: Duplicate username rejected
- **WHEN** a user attempts to create an account with an existing username
- **THEN** the system returns an error message
- **AND** no account is created

#### Scenario: Invalid password rejected
- **WHEN** a user provides a password shorter than minimum length (8 characters)
- **THEN** the system returns a validation error
- **AND** no account is created

### Requirement: Account Authentication
The system SHALL authenticate users via username and password, issuing JWT tokens for API access and session cookies for web interface.

#### Scenario: Successful login with JWT
- **WHEN** a user provides valid credentials to the API endpoint
- **THEN** the system returns a JWT access token and refresh token
- **AND** the tokens are signed with a secure secret key
- **AND** the access token expires after configured duration

#### Scenario: Successful login with session
- **WHEN** a user provides valid credentials to the web interface
- **THEN** the system creates a secure session cookie
- **AND** the session is stored server-side
- **AND** the user is redirected to their account page

#### Scenario: Failed login
- **WHEN** a user provides invalid credentials
- **THEN** the system returns an authentication error
- **AND** no token or session is created
- **AND** failed attempt is logged for security monitoring

### Requirement: Account Information Retrieval
The system SHALL allow authenticated users to retrieve their account information.

#### Scenario: Get account details
- **WHEN** an authenticated user requests their account information
- **THEN** the system returns account data (username, email, creation date, premium status)
- **AND** sensitive data (password hash) is excluded from response

#### Scenario: Unauthorized access denied
- **WHEN** an unauthenticated user attempts to access account information
- **THEN** the system returns a 401 Unauthorized error

### Requirement: Account Update
The system SHALL allow users to update their account information including email and password.

#### Scenario: Password change
- **WHEN** a user provides their current password and a new valid password
- **THEN** the system verifies the current password
- **AND** updates the password hash in the database
- **AND** invalidates existing sessions (except current)

#### Scenario: Email update
- **WHEN** a user updates their email address
- **THEN** the system validates the email format
- **AND** updates the email in the database
- **AND** optionally sends verification email to new address

### Requirement: Account Recovery
The system SHALL provide password recovery mechanism via email.

#### Scenario: Password recovery request
- **WHEN** a user requests password recovery with their email address
- **THEN** the system generates a secure recovery token
- **AND** sends an email with recovery link
- **AND** the token expires after configured duration (e.g., 1 hour)

#### Scenario: Password reset
- **WHEN** a user follows recovery link with valid token
- **THEN** the system allows setting a new password
- **AND** invalidates the recovery token
- **AND** invalidates all existing sessions

### Requirement: Session Management
The system SHALL manage user sessions with configurable expiration and logout capability.

#### Scenario: Session expiration
- **WHEN** a user's session exceeds the configured timeout period
- **THEN** the system invalidates the session
- **AND** subsequent requests require re-authentication

#### Scenario: Explicit logout
- **WHEN** a user explicitly logs out
- **THEN** the system invalidates their current session
- **AND** clears session cookies
- **AND** redirects to login page

### Requirement: Premium Account Management
The system SHALL track and manage premium account status and VIP days.

#### Scenario: Premium status check
- **WHEN** querying an account's premium status
- **THEN** the system calculates remaining VIP days
- **AND** returns premium status (active/inactive)
- **AND** returns expiration date if premium is active

#### Scenario: Premium days addition
- **WHEN** an administrator adds premium days to an account
- **THEN** the system updates the premium_ends field
- **AND** the change is logged for audit purposes
