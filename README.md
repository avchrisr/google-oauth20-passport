# google-oauth20-passport

> Google Oauth2.0 Auth using passport.js, and server-side rendered VIEW template using handlebar engine

## OAuth 2.0
OAuth 2.0 is the successor to OAuth 1.0, and is designed to overcome perceived shortcomings in the earlier version. The authentication flow is essentially the same. The user is first redirected to the service provider to authorize access. After authorization has been granted, the user is redirected back to the application with a code that can be exchanged for an access token. The application requesting access, known as a client, is identified by an ID and secret.

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