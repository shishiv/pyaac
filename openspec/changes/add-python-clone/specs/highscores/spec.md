# Highscores Capability

## ADDED Requirements

### Requirement: Experience Highscores
The system SHALL display rankings of characters by experience points.

#### Scenario: View experience rankings
- **WHEN** users view experience highscores
- **THEN** the system displays characters sorted by experience (descending)
- **AND** displays rank, character name, level, vocation, and experience
- **AND** paginates results (50-100 per page)

#### Scenario: Vocation filtering
- **WHEN** filtering experience highscores by vocation
- **THEN** the system displays only characters of the selected vocation
- **AND** rankings are recalculated for filtered subset

### Requirement: Skill Highscores
The system SHALL display rankings for individual skills.

#### Scenario: View skill rankings
- **WHEN** users view highscores for a specific skill (magic, fist, club, sword, axe, distance, shielding, fishing)
- **THEN** the system displays characters sorted by skill level and progress
- **AND** displays rank, character name, vocation, skill level, and percentage

#### Scenario: Multiple skill categories
- **WHEN** viewing skill highscores
- **THEN** the system provides tabs or dropdown for each skill type
- **AND** allows switching between skill categories without page reload

### Requirement: Loyalty Highscores
The system SHALL display rankings by loyalty points if the server uses loyalty system.

#### Scenario: View loyalty rankings
- **WHEN** users view loyalty highscores
- **THEN** the system displays characters sorted by loyalty points
- **AND** displays rank, character name, and loyalty points
- **AND** indicates if loyalty system is enabled on the server

### Requirement: Highscore Caching
The system SHALL cache highscore data for performance optimization.

#### Scenario: Cached highscores
- **WHEN** highscores are requested
- **THEN** the system serves cached results if available and fresh (e.g., < 5 minutes old)
- **AND** regenerates cache on expiration or manual invalidation

### Requirement: Online Status Indicator
The system SHALL indicate which highscore characters are currently online.

#### Scenario: Online players in highscores
- **WHEN** viewing any highscore listing
- **THEN** the system marks currently online characters with an indicator
- **AND** optionally highlights online players

### Requirement: Character Profile Links
The system SHALL link highscore entries to character profiles.

#### Scenario: Navigate to character profile
- **WHEN** a user clicks on a character name in highscores
- **THEN** the system navigates to the character's detailed profile page
- **AND** displays full character information

### Requirement: Search in Highscores
The system SHALL allow searching for specific characters in rankings.

#### Scenario: Find character rank
- **WHEN** a user searches for a character name
- **THEN** the system displays the character's rank in selected highscore category
- **AND** shows nearby rankings for context (e.g., ±10 positions)
