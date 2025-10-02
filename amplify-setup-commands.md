# Amplify Setup Commands

## Prerequisites
```bash
npm install -g @aws-amplify/cli
amplify configure
```

## Initialize Amplify Project
```bash
amplify init
# Follow prompts:
# - Project name: realtime-chat-app
# - Environment: dev
# - Default editor: Visual Studio Code
# - App type: javascript
# - Javascript framework: react
# - Source Directory Path: src
# - Distribution Directory Path: build
# - Build Command: npm run build
# - Start Command: npm run start
```

## Add Authentication (Cognito)
```bash
amplify add auth
# Choose: Default configuration with username
# Sign-in method: Email
# Advanced settings: No
```

## Add API (AppSync GraphQL)
```bash
amplify add api
# Choose: GraphQL
# API name: chatapp
# Authorization type: Amazon Cognito User Pool
# Additional auth types: No
# Annotated GraphQL schema: Yes
# Guided schema creation: No (use existing schema.graphql)
# Edit schema now: No
```

## Add Storage (S3)
```bash
amplify add storage
# Choose: Content (Images, audio, video, etc.)
# Resource name: chatappstorages3bucket
# Bucket name: (accept default)
# Access: Auth users only
# Authenticated users access: create/update, read, delete
# Lambda trigger: No
```

## Add Functions (Lambda)
```bash
# Authorization function
amplify add function
# Choose: Lambda function
# Function name: chatappAuthz
# Runtime: NodeJS
# Template: Hello World
# Advanced settings: No

# Presigned URL function  
amplify add function
# Function name: chatappPresign
# Runtime: NodeJS
# Template: Hello World
# Advanced settings: No

# Notifications function
amplify add function
# Function name: chatappNotifications
# Runtime: NodeJS
# Template: Hello World
# Advanced settings: No
```

## Add Hosting
```bash
amplify add hosting
# Choose: Amplify Console
# Type: Manual deployment
```

## Deploy Backend
```bash
amplify push
# Review and confirm changes
# Generate code: Yes
# Code generation language: typescript
# File name pattern: src/graphql/**/*.ts
# Generate docs: No
# Max depth: 2
```

## Environment Management
```bash
# Create new environment
amplify env add
# Environment name: prod

# Switch environments
amplify env checkout dev
amplify env checkout prod

# Pull backend changes
amplify pull
```

## Deployment
```bash
# Deploy all changes
amplify push

# Deploy with CI/CD
amplify publish
```