# google-oauth20-passport

> Google Oauth2.0 Auth using passport.js, and server-side rendered VIEW template using handlebar engine

## Pre-requisite
- Set up OAuth Client ID Credentials in Google Cloud Console, and get OAuth Client ID and Client Secret
  - Google+ API needs to be enabled if not already enabled
  - Create a project if not already exist
  - Create OAuth Client ID Credentials
    - Application Type: Web application
    - Name: My Web Client 1
    - Callback/Redirect URL: ex) `http://localhost:5000/auth/google/callback`   <-- must be changed for non-local env

## Usage

- Create `config/variables.env` file, with following environment variables
```
NODE_ENV=development
PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@<host>/<db-name>?retryWrites=true&w=majority
POOLSIZE=10

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# BELOW URL IS FOR LOCALHOST ONLY
CALLBACK_URL=http://localhost:5000/auth/google/callback
```

## Install Dependencies
```
npm install
```

## Run App
```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```