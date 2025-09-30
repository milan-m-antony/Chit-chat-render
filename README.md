# Chit-Chat

A secure, real-time chat application built with Next.js 14+, TypeScript, Socket.IO, and modern web technologies.

## Features

- Real-time messaging with WebSocket support
- User authentication with NextAuth.js
- Responsive design using Tailwind CSS
- Dark/Light theme support
- Message search functionality
- User presence indicators
- Typing indicators
- Message read receipts
- File sharing capabilities
- Emoji picker
- Rate limiting and security features

## Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chit-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the .env file with your configuration values.

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Testing

Run the test suite:
```bash
npm test
```

## Production Deployment

### Deploy to Render

1. Fork this repository to your GitHub account.
2. Create a new Web Service on Render.
3. Connect your GitHub repository.
4. Render will automatically detect the configuration from render.yaml.
5. Deploy!

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your application's URL
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js
- `MAX_REQUESTS_PER_MINUTE`: Rate limiting configuration
- `SOCKET_PORT`: Port for Socket.IO server
- `RENDER_EXTERNAL_URL`: Automatically set by Render

## Security Features

- CSRF protection
- Rate limiting
- Input sanitization
- Secure headers
- Password hashing with bcrypt
- JWT token authentication

## Project Structure

```
/src
  /app              # Next.js App Router pages
  /api              # API routes
  /auth            # Authentication related code
  /chat            # Chat functionality
  /components      # React components
  /hooks           # Custom React hooks
  /lib             # Utility functions
  /types           # TypeScript type definitions
/public           # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. Database Connection Issues
   - Check if PostgreSQL is running
   - Verify DATABASE_URL in .env

2. WebSocket Connection Issues
   - Check if SOCKET_PORT is configured correctly
   - Verify firewall settings

3. Authentication Issues
   - Ensure NEXTAUTH_URL is set correctly
   - Check NEXTAUTH_SECRET is properly configured

For more issues, please check the GitHub Issues page.

## Support

For support, please open an issue in the GitHub repository.