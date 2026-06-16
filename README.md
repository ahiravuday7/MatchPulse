# MatchPulse

MatchPulse is a football tracking web application inspired by FotMob. It is built with a MERN-style architecture and focuses on live football data, fixtures, match details, league standings, team details, player details, favorites, authentication, caching, cron-based synchronization, API usage monitoring, and production-ready backend structure.

The backend is designed around one important product rule:

```text
Reading football data = Guest allowed
Saving personal data = Login required
```

---

## External API Service

MatchPulse uses **API-Football by API-Sports** as the external football data provider.

```text
API Service Used: API-Football by API-Sports
Base URL: https://v3.football.api-sports.io
Environment Variable: API_FOOTBALL_KEY
Authentication Header: x-apisports-key
```

The API key is stored securely in the backend `.env` file and is accessed through:

```env
API_FOOTBALL_KEY=your_api_football_key
```

The backend sends this key in every external API request using the `x-apisports-key` header.

MatchPulse does **not** expose the API key to the frontend.

## Features

### Guest Features

Guest users can access public football data without login:

- View live matches
- View today’s fixtures
- View finished matches
- View match details
- View league standings
- View team details
- View team squad
- View team players with season statistics
- Search teams
- Search leagues
- Search players
- View player details
- Use football data endpoints without authentication

Guest favorites can be stored later on the frontend using browser localStorage.

---

### Authenticated User Features

Logged-in users can save and restore personal data:

- Register account
- Login with JWT
- Get current user profile
- Logout
- Update profile
- Delete account
- Add favorite team
- Add favorite league
- Remove favorite
- View saved favorites
- Sync guest favorites after login
- Restore favorites after relogin

---

### Backend Features

- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Request validation with express-validator
- Centralized error handling
- Custom `AppError` class
- Async controller wrapper
- MongoDB response caching
- Dynamic cache duration
- API-Football usage monitoring
- Daily API safety budget
- Rate limiting
- Helmet security headers
- CORS configuration
- Cron jobs for background football sync
- Health, liveness, and readiness endpoints
- Environment validation
- Graceful shutdown
- Production-style backend structure

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Axios
- node-cron
- express-rate-limit
- express-validator
- Helmet
- Morgan
- CORS
- dotenv

### External API

- API-Football / API-Sports

---

## Project Structure

```text
server/
  src/
    config/
      db.js
      env.js
      validateEnv.js

    controllers/
      apiUsageController.js
      authController.js
      cacheTestController.js
      favoriteController.js
      footballController.js
      healthController.js

    jobs/
      footballSyncJob.js

    middleware/
      asyncHandler.js
      authMiddleware.js
      errorMiddleware.js
      rateLimiter.js
      validateRequest.js

    models/
      ApiUsage.js
      Cache.js
      Favorite.js
      User.js

    routes/
      apiUsageRoutes.js
      authRoutes.js
      cacheTestRoutes.js
      favoriteRoutes.js
      footballRoutes.js
      healthRoutes.js

    services/
      apiFootballService.js
      apiUsageService.js
      cacheService.js
      favoriteService.js
      footballService.js

    utils/
      AppError.js
      cacheDurations.js
      cacheKeys.js
      dateUtils.js
      fixtureFormatter.js
      generateToken.js
      leagueFormatter.js
      matchUtils.js
      playerFormatter.js
      searchFormatter.js
      squadFormatter.js
      teamFormatter.js

    validators/
      authValidators.js
      favoriteValidators.js
      footballValidators.js
      userValidators.js

    app.js
    server.js
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd MatchPulse
```

---

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

### 3. Create Environment File

Create a `.env` file inside the `server` folder.

Use `server/.env.example` as reference.

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_at_least_16_characters
JWT_EXPIRES_IN=7d

API_FOOTBALL_KEY=your_api_football_key

CLIENT_URL=http://localhost:5173

API_DAILY_LIMIT=100
API_SOFT_LIMIT=90
```

---

### 4. Start Development Server

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

---

### 5. Start Production-Style Server

```bash
npm start
```

---

## Environment Variables

| Variable           | Description                                 |
| ------------------ | ------------------------------------------- |
| `NODE_ENV`         | Application environment                     |
| `PORT`             | Backend server port                         |
| `MONGO_URI`        | MongoDB connection string                   |
| `JWT_SECRET`       | Secret used to sign JWT tokens              |
| `JWT_EXPIRES_IN`   | JWT expiry duration                         |
| `API_FOOTBALL_KEY` | API-Football / API-Sports key               |
| `CLIENT_URL`       | Frontend URL allowed by CORS                |
| `API_DAILY_LIMIT`  | Provider daily API limit                    |
| `API_SOFT_LIMIT`   | Internal safety limit before provider limit |

---

## API Endpoints

---

## Health

```text
GET /api/health
GET /api/health/live
GET /api/health/ready
```

---

## Auth

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
PATCH  /api/auth/profile
DELETE /api/auth/account
```

### Register

```http
POST /api/auth/register
```

```json
{
  "name": "Dipak Ahirav",
  "email": "dipak@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "dipak@example.com",
  "password": "password123"
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer YOUR_TOKEN
```

### Update Profile

```http
PATCH /api/auth/profile
Authorization: Bearer YOUR_TOKEN
```

```json
{
  "name": "Dipak Ahirav"
}
```

### Delete Account

```http
DELETE /api/auth/account
Authorization: Bearer YOUR_TOKEN
```

---

## Football Public Data

These endpoints are guest-accessible.

```text
GET /api/football/matches/live
GET /api/football/fixtures/today
GET /api/football/matches/finished
GET /api/football/matches/:matchId
GET /api/football/leagues/:leagueId/standings
GET /api/football/teams/:teamId
GET /api/football/teams/:teamId/squad
GET /api/football/teams/:teamId/players
GET /api/football/search
GET /api/football/players/search
GET /api/football/players/:playerId
```

---

### Live Matches

```http
GET /api/football/matches/live
```

---

### Today Fixtures

```http
GET /api/football/fixtures/today
```

---

### Finished Matches

```http
GET /api/football/matches/finished
```

---

### Match Details

```http
GET /api/football/matches/:matchId
```

Example:

```http
GET /api/football/matches/123456
```

---

### League Standings

```http
GET /api/football/leagues/:leagueId/standings?season=2024
```

Example:

```http
GET /api/football/leagues/39/standings?season=2024
```

---

### Team Details

```http
GET /api/football/teams/:teamId?season=2024
```

Example:

```http
GET /api/football/teams/42?season=2024
```

---

### Team Squad

```http
GET /api/football/teams/:teamId/squad
```

Example:

```http
GET /api/football/teams/42/squad
```

Returns current squad grouped by:

```text
goalkeepers
defenders
midfielders
attackers
other
```

---

### Team Players With Stats

```http
GET /api/football/teams/:teamId/players?season=2024
```

Example:

```http
GET /api/football/teams/42/players?season=2024&limit=20
```

This returns player profile data plus season statistics.

---

### Search Teams and Leagues

```http
GET /api/football/search?q=arsenal
GET /api/football/search?q=arsenal&type=team
GET /api/football/search?q=premier&type=league
```

Supported search types:

```text
all
team
league
```

---

### Search Players

```http
GET /api/football/players/search?q=saka&season=2024
```

---

### Player Details

```http
GET /api/football/players/:playerId?season=2024
```

Example:

```http
GET /api/football/players/1460?season=2024
```

Returns:

```text
Player profile
Nationality
Birth information
Height
Weight
Injury status
Photo
Team statistics
League statistics
Appearances
Goals
Assists
Cards
Shots
Passes
Tackles
Duels
Dribbles
Penalties
```

---

## Favorites

Favorites require authentication.

```text
POST   /api/favorites
POST   /api/favorites/sync
GET    /api/favorites
DELETE /api/favorites/:favoriteId
```

---

### Add Favorite

```http
POST /api/favorites
Authorization: Bearer YOUR_TOKEN
```

```json
{
  "type": "team",
  "externalId": 42,
  "name": "Arsenal",
  "logo": "https://media.api-sports.io/football/teams/42.png",
  "country": "England"
}
```

---

### Get My Favorites

```http
GET /api/favorites
Authorization: Bearer YOUR_TOKEN
```

---

### Remove Favorite

```http
DELETE /api/favorites/:favoriteId
Authorization: Bearer YOUR_TOKEN
```

---

### Sync Guest Favorites

```http
POST /api/favorites/sync
Authorization: Bearer YOUR_TOKEN
```

```json
{
  "favorites": [
    {
      "type": "team",
      "externalId": 42,
      "name": "Arsenal",
      "logo": "https://media.api-sports.io/football/teams/42.png",
      "country": "England"
    },
    {
      "type": "league",
      "externalId": 39,
      "name": "Premier League",
      "logo": "https://media.api-sports.io/football/leagues/39.png",
      "country": "England"
    }
  ]
}
```

This is used when a guest user logs in and wants to permanently save local favorites.

---

## API Usage

API usage endpoint requires authentication.

```http
GET /api/usage/today
Authorization: Bearer YOUR_TOKEN
```

Example response:

```json
{
  "success": true,
  "data": {
    "date": "2026-06-16",
    "budget": {
      "dailyLimit": 100,
      "safetyLimit": 90,
      "used": 12,
      "remainingBeforeSafetyStop": 78,
      "estimatedProviderRemaining": 88,
      "percentageUsed": 12
    },
    "requests": {
      "total": 12,
      "successful": 12,
      "failed": 0
    },
    "endpoints": {
      "fixtures_by_date": 1,
      "team_squad": 1,
      "player_search": 1
    },
    "statusCodes": {
      "200": 12
    },
    "lastRequestAt": "2026-06-16T10:00:00.000Z"
  }
}
```

---

## Caching Strategy

MatchPulse uses MongoDB to cache API-Football responses.

This protects the free API limit and improves response speed.

### Cache Durations

| Data                   |   Duration |
| ---------------------- | ---------: |
| Live matches           |   1 minute |
| Today fixtures         | 10 minutes |
| Finished matches       | 10 minutes |
| Live match details     |  5 minutes |
| Finished match details |   24 hours |
| League standings       |   12 hours |
| Team details           |   24 hours |
| Team squad             |   24 hours |
| Team players           |   24 hours |
| Team search            |   24 hours |
| League search          |   24 hours |
| Player search          |   24 hours |
| Player details         |   24 hours |

---

## API Usage Protection

External API calls are tracked at the API client boundary.

That means:

```text
MongoDB cache hit = not counted
Real API-Football request = counted
```

The backend tracks:

- Total daily requests
- Successful requests
- Failed requests
- Endpoint-wise usage
- HTTP status-code usage
- Remaining daily safety budget

Example:

```env
API_DAILY_LIMIT=100
API_SOFT_LIMIT=90
```

This means the backend stops making external API calls after 90 tracked requests, leaving a safety buffer before the provider limit.

---

## Cron Jobs

MatchPulse uses background cron jobs to prefetch selected football data.

Cron jobs are automatically counted by API usage monitoring because they use the same API-Football service layer.

Examples:

```text
Live matches sync
Today fixtures sync
Popular league standings sync
```

---

## Security Features

- Helmet security headers
- CORS configuration
- Request body size limit
- Rate limiting
- Auth-specific rate limiter
- Football endpoint limiter
- Search endpoint limiter
- JWT protected routes
- Password hashing
- Request validation
- Centralized error handling
- Environment validation
- Graceful shutdown
- Secure `.env` handling

---

## Guest vs Logged-In Behavior

### Guest User

```text
Can read football data
Can search teams, leagues, players
Can view match, team, league, player data
Can store temporary favorites in browser localStorage
Cannot save data to backend
```

### Logged-In User

```text
Can save favorites to MongoDB
Can sync guest favorites after login
Can restore favorites after relogin
Can update profile
Can delete account
Can access protected personal endpoints
```

---

## Frontend Sync Flow

Planned frontend behavior:

```text
User opens app
  ↓
No token
  ↓
Guest mode
  ↓
Favorites saved in localStorage
  ↓
User logs in
  ↓
POST /api/favorites/sync
  ↓
Guest favorites are saved to MongoDB
  ↓
Clear guest favorites from localStorage
  ↓
GET /api/favorites
  ↓
Render personalized home
```

---

## Route Access Summary

| Feature          | Guest | Login Required |
| ---------------- | ----: | -------------: |
| Live matches     |   Yes |             No |
| Fixtures         |   Yes |             No |
| Match details    |   Yes |             No |
| League standings |   Yes |             No |
| Team details     |   Yes |             No |
| Team squad       |   Yes |             No |
| Team players     |   Yes |             No |
| Player search    |   Yes |             No |
| Player details   |   Yes |             No |
| Add favorite     |    No |            Yes |
| View favorites   |    No |            Yes |
| Sync favorites   |    No |            Yes |
| Profile          |    No |            Yes |
| Delete account   |    No |            Yes |
| API usage        |    No |            Yes |

---

## Development Scripts

Inside the `server` folder:

```bash
npm run dev
```

Starts the backend with nodemon.

```bash
npm start
```

Starts the backend using Node.

---

## Production Readiness

The backend includes:

- Environment validation
- Health checks
- Liveness check
- Readiness check
- Graceful shutdown
- Centralized error handling
- API quota protection
- Request validation
- Rate limiting
- Secure configuration structure

---

## Git Safety

The project should not commit sensitive files.

Ignored files include:

```text
node_modules/
.env
.env.local
dist/
build/
coverage/
logs/
```

Use `.env.example` to document required environment variables without exposing secrets.

---

## Current Status

Backend development is complete through:

```text
Phase 1  - Backend setup
Phase 2  - MongoDB cache
Phase 3  - API-Football integration
Phase 4  - Today fixtures
Phase 5  - Finished matches
Phase 6  - Match details
Phase 7  - League standings
Phase 8  - Team details
Phase 9  - Authentication
Phase 10 - Favorites
Phase 11 - Cron sync jobs
Phase 12 - Centralized error handling
Phase 13 - Rate limiting and validation
Phase 14 - Football search
Phase 15 - Team squad
Phase 16 - API usage monitoring
Phase 16.5 - Logout, README, .gitignore, .env.example
Phase 16.6 - Guest mode, favorite sync, account management
Phase 17 - Production readiness
Phase 18 - Player search and player details
```

Next major stage:

```text
Frontend Phase 1 - React App Setup + Routing + Layout
```

---

## Author

Dipak Ahirav
