# Project Context

## Purpose
MyAAC is a free and open-source Automatic Account Creator (AAC) for Open Tibia Servers written in PHP. It is a fork of the Gesior project and provides a complete web-based account management system for Open Tibia game servers. The project supports MySQL databases and offers features for account creation, character management, guilds, news, forums, and premium account handling.

Official website: https://my-aac.org
Documentation: https://docs.my-aac.org

## Tech Stack

### Backend
- PHP 8.1+ (current stable version)
- MySQL database
- Composer for dependency management

### Key PHP Dependencies
- **Twig 3.11** - Templating engine
- **Laravel Eloquent 10.18** - Database ORM
- **FastRoute 1.3** - URL routing
- **PHPMailer 6.1** - Email functionality
- **Guzzle 7.9** - HTTP client
- **Symfony Components** (Console, VarDumper, String)
- **Parsedown 1.7** - Markdown parser
- **Whoops 2.15** - Error handler
- **DebugBar 1.x** - Debugging tool

### Frontend
- **jQuery 3.7.1** - JavaScript framework
- **jQuery UI 1.13.2** - UI components
- **Bootstrap 4.6.2** - CSS framework
- **TinyMCE 7.2.0** - Rich text editor

### Development Tools
- **Cypress 14.3.3** - E2E testing framework
- **PHPStan** (level 3) - Static analysis tool
- **npm** - Frontend package management

### Required PHP Extensions
- pdo, pdo_mysql, json, xml, dom (required)
- zip (optional - for plugin installation)
- gd (optional - for signature image generation)

## Project Conventions

### Code Style
- **Indentation**: Tabs with size 4 (defined in .editorconfig)
- **Line endings**: Unix (LF) with newline at end of files
- **JSON files**: Use spaces for indentation (size 2 for package.json, 4 for composer.json)
- **YAML files**: Use spaces with size 2
- **Static analysis**: PHPStan level 3 enforcement
- **File permissions**:
  - config.local.php: 660
  - images/guilds, images/houses, images/gallery: 660
  - system/cache: 760 (recursive)

### Architecture Patterns

#### Directory Structure
- `system/` - Core application code
  - `system/src/` - PSR-4 autoloaded classes (namespace: MyAAC\)
  - `system/pages/` - Page controllers
  - `system/templates/` - Twig template files
  - `system/migrations/` - Database migrations
  - `system/cache/` - Application cache
  - `system/locale/` - Internationalization files
- `templates/` - Theme templates (tibiacom, kathrine)
- `admin/` - Admin panel
- `plugins/` - Plugin system directory
- `install/` - Installation wizard
- `tools/` - Utility scripts

#### Key Patterns
- **MVC-like structure**: Pages act as controllers, Twig for views, Eloquent models
- **Routing**: FastRoute-based URL routing (system/routes.php)
- **Templating**: Twig 3.x with custom filters and functions
- **Database**: Laravel Eloquent ORM with legacy database support
- **Plugin System**: Extensible plugin architecture
- **Hook System**: Event-driven hooks for extensibility
- **Migration System**: Database schema versioning
- **Caching**: File-based caching with TTL support

### Testing Strategy
- **E2E Testing**: Cypress tests in `cypress/e2e/` directory
- **Static Analysis**: PHPStan level 3 (run before commits)
- **CI/CD**: GitHub Actions workflow running Cypress tests
- **Manual Testing**: Installation wizard testing for new releases
- **Regression Testing**: Test against multiple Open Tibia server distributions

### Git Workflow
MyAAC follows the **Git Flow Workflow** (https://danielkummer.github.io/git-flow-cheatsheet):

#### Branches
- `main` - Stable release branch (v1.x - active development)
- `develop` - Next release development branch (v2.x - experimental features)
- `feature/*` - Feature development branches
- `0.8` - Active support for legacy version
- `0.9`, `0.7` - Legacy branches (0.7 is EOL)

#### Contribution Rules
- **Pull requests**: Must target `develop` branch for new features
- **Bug fixes**: Target `main` branch for current release fixes
- **Commit messages**: Clear, descriptive messages following conventional format
- **Code review**: Required before merging
- **Testing**: Ensure PHPStan passes and Cypress tests run

#### Version Support
- **1.x**: Active development (PHP >= 8.1)
- **2.x**: Experimental features (PHP >= 8.1)
- **0.8.x**: Active support (PHP >= 7.2.5)
- **0.7.x**: End of Life

## Domain Context

### Open Tibia Servers
MyAAC is designed for **Open Tibia Servers** (OTS), which are private servers for the MMORPG game Tibia. Key concepts:

- **Accounts**: Player accounts that can contain multiple characters
- **Characters**: In-game characters with attributes (level, vocation, skills)
- **Guilds**: Player organizations with ranks and membership
- **Premium Time**: Subscription-based premium features (VIP days)
- **Vocations**: Character classes (Knight, Paladin, Sorcerer, Druid)
- **Highscores**: Rankings by experience, skills, loyalty points
- **Server Status**: Real-time server monitoring and player counts
- **News System**: Announcements and updates
- **Server Compatibility**: Supports multiple OTS distributions (TFS, Canary, OTServBR, etc.)

### Database Schema Compatibility
- Must support various Open Tibia server database schemas
- Detects column existence dynamically (e.g., "deletion" column in guilds)
- Supports both legacy and modern database structures
- Handles different premium time implementations

## Important Constraints

### Technical Constraints
- **PHP Version**: Minimum PHP 8.1 for current stable version
- **Database**: MySQL only (no PostgreSQL support)
- **Web Server**: Apache2 recommended (mod_rewrite for friendly URLs)
- **File Permissions**: Specific permissions required for images and cache
- **Shared Hosting**: Must work on shared hosting environments
- **Backwards Compatibility**: Maintain compatibility with existing OTS databases

### Security Constraints
- **Input Validation**: All user input must be validated and sanitized
- **SQL Injection**: Use Eloquent ORM and prepared statements
- **XSS Prevention**: Escape HTML output in templates
- **CSRF Protection**: Implement for forms
- **Authentication**: Secure password hashing and session management
- **File Upload**: Validate file types for guild logos, avatars

### Business Constraints
- **GPL-3.0 License**: All code must be GPL-3.0 compatible
- **Free and Open Source**: No proprietary dependencies
- **Community-driven**: Accept community contributions
- **Documentation**: Maintain comprehensive documentation

### Compatibility Constraints
- **Server Distributions**: Support TFS, Canary, OTServBR, and other OTS variants
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Template System**: Maintain backward compatibility with existing themes

## External Dependencies

### External Services
- **PHPMailer**: Email sending (SMTP configuration required)
- **Matomo Device Detector**: User agent detection
- **Composer Packagist**: Package repository

### Game Server Integration
- **MySQL Database**: Shared database with OTS server
- **Server Status Protocol**: TCP connection to game server for status
- **Login System**: Integration with OTS authentication
- **Character Data**: Real-time sync with game server database

### Optional Services
- **reCAPTCHA**: Bot protection (configurable)
- **Payment Gateways**: Premium account purchases (plugin-based)
- **CDN**: For static assets (optional)

### Build Tools
- **Composer**: PHP dependency management
- **npm**: Frontend asset management
- **Cypress**: E2E testing framework
- **GitHub Actions**: CI/CD pipeline
