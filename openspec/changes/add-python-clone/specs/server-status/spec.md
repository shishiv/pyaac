# Server Status Capability

## ADDED Requirements

### Requirement: Server Connectivity Check
The system SHALL check game server status via TCP connection.

#### Scenario: Server online check
- **WHEN** checking server status
- **THEN** the system attempts TCP connection to configured game server host and port
- **AND** reports server as online if connection succeeds
- **AND** reports server as offline if connection fails or times out

#### Scenario: Connection timeout handling
- **WHEN** the game server does not respond within timeout period (e.g., 5 seconds)
- **THEN** the system marks server as offline
- **AND** logs the connection failure for diagnostics

### Requirement: Online Players Count
The system SHALL retrieve and display the number of players currently online.

#### Scenario: Display online count
- **WHEN** server status is checked
- **THEN** the system queries the database for online players
- **AND** displays the current player count
- **AND** displays peak players for the day

#### Scenario: Maximum players capacity
- **WHEN** displaying server status
- **THEN** the system shows current players vs maximum capacity
- **AND** indicates server load percentage

### Requirement: Server Uptime Tracking
The system SHALL track and display server uptime information.

#### Scenario: Uptime calculation
- **WHEN** displaying server status
- **THEN** the system calculates uptime since last server start
- **AND** displays uptime in human-readable format (days, hours, minutes)

### Requirement: Server Information Display
The system SHALL display server configuration and information.

#### Scenario: Server details
- **WHEN** viewing server status page
- **THEN** the system displays server name, version, location
- **AND** displays experience rate, skill rate, loot rate
- **AND** displays server type (PvP, PvE, PvP-enforced)

### Requirement: Online Players List
The system SHALL display a list of currently online players.

#### Scenario: View online players
- **WHEN** users view the online players list
- **THEN** the system displays character names, levels, and vocations
- **AND** optionally displays character location if privacy settings allow
- **AND** updates periodically (e.g., every 30 seconds)

#### Scenario: Privacy filtering
- **WHEN** displaying online players
- **THEN** the system respects character privacy settings
- **AND** excludes hidden/invisible characters if configured

### Requirement: Status Caching
The system SHALL cache server status data to reduce database load.

#### Scenario: Cached status
- **WHEN** server status is requested
- **THEN** the system returns cached data if available and fresh (e.g., < 30 seconds old)
- **AND** refreshes cache on expiration

### Requirement: Real-time Updates
The system SHALL support real-time status updates via WebSocket.

#### Scenario: WebSocket status stream
- **WHEN** a client connects to status WebSocket endpoint
- **THEN** the system sends periodic status updates
- **AND** pushes immediate updates on player login/logout events
- **AND** handles client disconnection gracefully

### Requirement: Status Error Logging
The system SHALL log server status errors for troubleshooting.

#### Scenario: Connection failure logging
- **WHEN** server status check fails
- **THEN** the system logs error details to status-error.log
- **AND** includes timestamp, error type, and connection parameters
- **AND** does not spam logs (rate-limited logging)
