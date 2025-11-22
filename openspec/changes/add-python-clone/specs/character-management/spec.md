# Character Management Capability

## ADDED Requirements

### Requirement: Character Creation
The system SHALL allow account owners to create new characters with valid names and vocations.

#### Scenario: Successful character creation
- **WHEN** a user creates a character with valid name and vocation
- **THEN** the system creates a character record linked to their account
- **AND** the character starts at level 1 with default stats
- **AND** the character is placed in the starting town

#### Scenario: Invalid character name rejected
- **WHEN** a user attempts to create a character with invalid name (special characters, too short/long)
- **THEN** the system returns a validation error
- **AND** no character is created

#### Scenario: Character limit enforced
- **WHEN** a user attempts to create more characters than the account limit
- **THEN** the system returns an error indicating limit reached
- **AND** no character is created

### Requirement: Character Listing
The system SHALL display all characters belonging to an account with their current stats.

#### Scenario: View account characters
- **WHEN** a user views their account characters
- **THEN** the system returns a list of all characters
- **AND** each character includes name, level, vocation, world
- **AND** characters are ordered by name or level

### Requirement: Character Details
The system SHALL display detailed information for a specific character.

#### Scenario: View character profile
- **WHEN** viewing a character's profile
- **THEN** the system displays name, level, vocation, experience
- **AND** displays skills (magic level, fist, club, sword, axe, distance, shielding, fishing)
- **AND** displays health, mana, capacity
- **AND** displays residence (town/house if applicable)
- **AND** displays guild membership if applicable

### Requirement: Character Deletion
The system SHALL allow account owners to delete their characters with confirmation.

#### Scenario: Character deletion
- **WHEN** a user requests to delete a character
- **THEN** the system requires confirmation
- **AND** verifies the character belongs to the user's account
- **AND** removes the character from the database

#### Scenario: Character deletion with guild leadership
- **WHEN** a user attempts to delete a character who is a guild leader
- **THEN** the system returns an error requiring guild leadership transfer first
- **AND** the character is not deleted

### Requirement: Vocation System
The system SHALL support multiple character vocations with appropriate stats.

#### Scenario: Vocation selection
- **WHEN** creating a character
- **THEN** the system offers available vocations (Knight, Paladin, Sorcerer, Druid)
- **AND** each vocation has appropriate starting stats
- **AND** vocation affects skill gain rates

### Requirement: Character Search
The system SHALL allow searching for characters by name.

#### Scenario: Character name search
- **WHEN** searching for a character by partial or full name
- **THEN** the system returns matching characters
- **AND** results include character level, vocation, and world
- **AND** results are limited to prevent abuse (max 50 results)

### Requirement: Online Status
The system SHALL display whether a character is currently online.

#### Scenario: Online character indicator
- **WHEN** viewing a character's profile
- **THEN** the system indicates if the character is currently logged into the game server
- **AND** displays the last login time if offline
