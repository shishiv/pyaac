# Guild Management Capability

## ADDED Requirements

### Requirement: Guild Creation
The system SHALL allow characters to create guilds with unique names.

#### Scenario: Successful guild creation
- **WHEN** a character creates a guild with valid name and description
- **THEN** the system creates a guild record in the database
- **AND** the creating character becomes the guild leader
- **AND** the guild is assigned a unique ID

#### Scenario: Guild name already exists
- **WHEN** attempting to create a guild with an existing name
- **THEN** the system returns an error indicating name is taken
- **AND** no guild is created

#### Scenario: Premium requirement check
- **WHEN** a non-premium character attempts to create a guild
- **THEN** the system checks if freePremium is enabled
- **AND** rejects creation if premium is required and not available

### Requirement: Guild Membership
The system SHALL manage guild membership with invitation and acceptance workflow.

#### Scenario: Guild invitation
- **WHEN** a guild leader or vice-leader invites a character
- **THEN** the system creates an invitation record
- **AND** the invited character receives notification

#### Scenario: Accept invitation
- **WHEN** a character accepts a guild invitation
- **THEN** the system adds the character to the guild
- **AND** assigns the default member rank
- **AND** removes the invitation record

#### Scenario: Leave guild
- **WHEN** a guild member leaves the guild
- **THEN** the system removes the character from guild membership
- **AND** the character's guild affiliation is cleared

### Requirement: Guild Ranks
The system SHALL support configurable guild ranks with permissions.

#### Scenario: Rank management
- **WHEN** a guild leader manages ranks
- **THEN** the system allows creating, editing, and deleting ranks
- **AND** each rank has a level (1-3, where 3 is leader)
- **AND** each rank has a name and permissions

#### Scenario: Assign rank
- **WHEN** a leader assigns a rank to a member
- **THEN** the system verifies the assigner has permission
- **AND** updates the member's rank
- **AND** the change is logged

### Requirement: Guild Information Display
The system SHALL display guild information including members and statistics.

#### Scenario: View guild profile
- **WHEN** viewing a guild's profile
- **THEN** the system displays guild name, logo, description
- **AND** displays list of members with their ranks and levels
- **AND** displays guild creation date
- **AND** displays total member count

#### Scenario: Guild member list
- **WHEN** viewing guild members
- **THEN** the system lists all members sorted by rank and level
- **AND** indicates online status for each member
- **AND** displays member vocation and level

### Requirement: Guild Deletion
The system SHALL allow guild leaders to disband guilds.

#### Scenario: Guild disbandment
- **WHEN** a guild leader disbands the guild
- **THEN** the system requires confirmation
- **AND** removes all member associations
- **AND** marks the guild as deleted or removes it from database
- **AND** notifies all members

### Requirement: Guild Logo
The system SHALL support custom guild logos uploaded by guild leaders.

#### Scenario: Upload guild logo
- **WHEN** a guild leader uploads a logo image
- **THEN** the system validates the file type (PNG, JPG, GIF)
- **AND** validates file size (max 50KB)
- **AND** stores the logo in images/guilds directory
- **AND** associates the logo with the guild

### Requirement: Guild Wars
The system SHALL support guild war declarations and management.

#### Scenario: Declare war
- **WHEN** a guild leader declares war on another guild
- **THEN** the system creates a war invitation
- **AND** the target guild must accept for war to begin

#### Scenario: Active guild war
- **WHEN** a guild war is active
- **THEN** the system tracks kills between guild members
- **AND** displays war statistics (kills, deaths)
- **AND** allows ending the war by mutual agreement or leader decision
