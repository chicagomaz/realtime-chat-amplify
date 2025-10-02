# Real-time Chat App

A modern, scalable real-time chat application built with **Next.js** and **AWS Amplify**. Features include real-time messaging, file attachments, message reactions, read receipts, typing indicators, and online presence.

## ✨ Features

- 🔐 **Authentication**: Email/password authentication with AWS Cognito
- 💬 **Real-time Messaging**: Instant message delivery with AppSync subscriptions
- 👥 **Direct & Group Chats**: Support for 1-on-1 and group conversations
- 📎 **File Attachments**: Upload and share images (JPG, PNG, GIF) and PDFs (up to 10MB)
- 😄 **Message Reactions**: React to messages with emojis (👍 ❤️ 😂 etc.)
- ✅ **Read Receipts**: See when messages have been read
- ✍️ **Typing Indicators**: Real-time typing status
- 🟢 **Online Presence**: See who's online and their last seen status
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔔 **Push Notifications**: Real-time notifications for new messages

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **AWS Amplify UI** - Pre-built authentication components

### Backend
- **AWS Amplify** - Full-stack development platform
- **AWS AppSync** - GraphQL API with real-time subscriptions
- **AWS Cognito** - User authentication and authorization
- **Amazon DynamoDB** - NoSQL database for storing messages and user data
- **Amazon S3** - File storage for attachments
- **AWS Lambda** - Serverless functions for business logic

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with appropriate permissions
- Amplify CLI installed globally

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd realtime-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize Amplify backend**
   ```bash
   amplify init
   ```
   Follow the prompts:
   - Project name: `realtime-chat-app`
   - Environment: `dev`
   - Default editor: `Visual Studio Code`
   - App type: `javascript`
   - Javascript framework: `react`
   - Source Directory Path: `src`
   - Distribution Directory Path: `build`
   - Build Command: `npm run build`
   - Start Command: `npm run start`

4. **Add Amplify services**

   **Authentication (Cognito):**
   ```bash
   amplify add auth
   ```
   - Choose: `Default configuration with username`
   - Sign-in method: `Email`

   **API (AppSync GraphQL):**
   ```bash
   amplify add api
   ```
   - Choose: `GraphQL`
   - API name: `chatapp`
   - Authorization type: `Amazon Cognito User Pool`
   - Use existing schema: `Yes` (use the provided `schema.graphql`)

   **Storage (S3):**
   ```bash
   amplify add storage
   ```
   - Choose: `Content (Images, audio, video, etc.)`
   - Resource name: `chatappstorages3bucket`
   - Access: `Auth users only`
   - Authenticated users access: `create/update, read, delete`

   **Functions (Lambda):**
   ```bash
   # Authorization function
   amplify add function
   # Function name: chatappAuthz
   # Runtime: NodeJS
   # Template: Hello World

   # Presigned URL function
   amplify add function
   # Function name: chatappPresign
   # Runtime: NodeJS
   # Template: Hello World

   # Notifications function
   amplify add function
   # Function name: chatappNotifications
   # Runtime: NodeJS
   # Template: Hello World
   ```

5. **Deploy the backend**
   ```bash
   amplify push
   ```
   - Review and confirm changes
   - Generate code: `Yes`
   - Code generation language: `typescript`
   - File name pattern: `src/graphql/**/*.ts`

6. **Start the development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## 📁 Project Structure

```
├── amplify/                    # Amplify backend configuration
│   ├── backend/
│   │   ├── api/
│   │   │   └── chatapp/
│   │   │       └── schema.graphql
│   │   ├── auth/              # Cognito configuration
│   │   ├── function/          # Lambda functions
│   │   │   ├── chatappAuthz/
│   │   │   ├── chatappPresign/
│   │   │   └── chatappNotifications/
│   │   └── storage/           # S3 configuration
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── auth/             # Authentication page
│   │   ├── conversations/    # Chat pages
│   │   ├── profile/          # User profile page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ConversationList.tsx
│   │   ├── ConversationCard.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── AttachmentUploader.tsx
│   │   ├── PresenceBadge.tsx
│   │   └── __tests__/        # Component tests
│   ├── lib/                  # Utility libraries
│   │   └── amplify.ts        # Amplify configuration
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── __tests__/           # Integration tests
├── amplify.yml              # Amplify CI/CD configuration
├── jest.config.js          # Jest configuration
├── jest.setup.js           # Jest setup file
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Component-level tests in `src/components/__tests__/`
- **Integration Tests**: Feature-level tests in `src/__tests__/integration/`
- **Test Coverage**: Configured to collect coverage from all TypeScript/JavaScript files

### Example Acceptance Tests

```bash
# Test user authentication flow
npm test -- --testNamePattern="authentication"

# Test message sending and receiving
npm test -- --testNamePattern="chat integration"

# Test file upload functionality
npm test -- --testNamePattern="attachment upload"
```

## 🚀 Deployment

### Amplify Hosting (Recommended)

1. **Add hosting**
   ```bash
   amplify add hosting
   ```
   - Choose: `Amplify Console`
   - Type: `Manual deployment`

2. **Deploy the app**
   ```bash
   amplify publish
   ```

### CI/CD with Amplify Console

1. **Connect your repository** to Amplify Console
2. **Configure build settings** (uses `amplify.yml`)
3. **Set environment variables** if needed
4. **Deploy automatically** on every push to main branch

The `amplify.yml` file is already configured for optimal builds:

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

## 🌍 Environment Management

### Creating New Environments

```bash
# Create production environment
amplify env add
# Environment name: prod

# Switch between environments
amplify env checkout dev
amplify env checkout prod

# Pull latest backend changes
amplify pull
```

### Environment Variables

Set environment-specific variables in Amplify Console:

- `NEXT_PUBLIC_AWS_REGION`
- `NEXT_PUBLIC_AWS_USER_POOLS_ID`
- `NEXT_PUBLIC_AWS_APP_CLIENT_ID`

## 📊 Monitoring and Analytics

### AWS CloudWatch

- Monitor Lambda function performance
- Track API Gateway metrics
- Set up alarms for error rates

### AWS X-Ray

- Enable distributed tracing for serverless functions
- Identify performance bottlenecks

### Custom Analytics

```typescript
// Track user engagement
import { Analytics } from 'aws-amplify';

Analytics.record({
  name: 'messagesSent',
  attributes: {
    conversationType: 'group',
    messageType: 'text'
  }
});
```

## 🔒 Security Best Practices

### Authentication & Authorization

- ✅ JWT tokens for API authentication
- ✅ Fine-grained access control with Cognito groups
- ✅ Conversation membership validation
- ✅ Secure file uploads with presigned URLs

### Data Protection

- ✅ HTTPS everywhere
- ✅ Input validation and sanitization
- ✅ File type and size validation
- ✅ No sensitive data in client-side code

### AWS Security

- ✅ IAM roles with least privilege
- ✅ VPC configuration for Lambda functions
- ✅ S3 bucket policies and CORS configuration
- ✅ DynamoDB encryption at rest

## 🐛 Troubleshooting

### Common Issues

**1. Amplify CLI not found**
```bash
npm install -g @aws-amplify/cli
```

**2. Authentication errors**
```bash
amplify auth update
amplify push
```

**3. GraphQL schema errors**
```bash
# Check schema.graphql syntax
amplify api gql-compile
```

**4. File upload issues**
- Check S3 bucket permissions
- Verify CORS configuration
- Check file size limits (10MB max)

**5. Real-time subscriptions not working**
- Verify WebSocket connections
- Check authentication tokens
- Review AppSync logs in CloudWatch

### Debug Mode

Enable debug logging:

```typescript
import { Amplify } from 'aws-amplify';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: false
  }
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write tests for new components and features

## 📝 API Documentation

### GraphQL Schema

The app uses a comprehensive GraphQL schema with the following main types:

- **User**: User profiles and presence
- **Conversation**: Chat conversations (direct/group)
- **Message**: Chat messages with attachments
- **MessageReaction**: Emoji reactions to messages
- **ReadReceipt**: Message read status
- **TypingIndicator**: Real-time typing status

### Key Mutations

```graphql
# Send a message
sendMessage(conversationId: ID!, content: String, type: MessageType!): Message

# Add reaction to message
addReaction(messageId: ID!, emoji: String!): MessageReaction

# Update typing status
updateTypingStatus(conversationId: ID!, isTyping: Boolean!): TypingIndicator

# Update user presence
updateUserPresence(isOnline: Boolean!): User
```

### Real-time Subscriptions

```graphql
# Listen for new messages
onMessageAdded(conversationId: ID!): Message

# Listen for typing updates
onTypingUpdated(conversationId: ID!): TypingIndicator

# Listen for presence changes
onUserPresenceUpdated(userId: ID!): User
```

## 📋 Roadmap

- [ ] Voice messages
- [ ] Video calls integration
- [ ] Message search functionality
- [ ] Dark mode support
- [ ] Desktop app with Electron
- [ ] Mobile app with React Native
- [ ] Message encryption
- [ ] Advanced admin controls

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📖 Documentation: [Full documentation](https://docs.example.com)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/example/issues)

---

**Built with ❤️ using Next.js and AWS Amplify**