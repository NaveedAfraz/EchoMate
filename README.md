# EchoMate

A feature-rich communication platform designed for seamless real-time messaging and collaboration.

## Tech Stack

![React.js](https://img.shields.io/badge/-React.js-61DAFB?style=flat-square&logo=react&logoColor=black)
![Shadcn](https://img.shields.io/badge/-Shadcn-000000?style=flat-square&logo=shadcn&logoColor=white)
![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white)
![Clerk](https://img.shields.io/badge/-Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![Socket.io](https://img.shields.io/badge/-Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)
![WebRTC](https://img.shields.io/badge/-WebRTC-333333?style=flat-square&logo=webrtc&logoColor=white)
![React-Redux](https://img.shields.io/badge/-React_Redux-764ABC?style=flat-square&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)

## Overview

EchoMate is a feature-rich communication platform designed for seamless real-time messaging and collaboration. The application offers instant messaging with read receipts, file sharing, and emoji reactions. Users can create group chats, direct messages, and channels for organized communication. The platform also supports voice and video calls with screen sharing capabilities, making it perfect for remote teams and friends. The intuitive interface prioritizes user experience with customizable themes and notification settings.

## Key Features

- **Instant Messaging**: Real-time text communication with read receipts
- **File Sharing**: Easily share documents, images, and media
- **Emoji Reactions**: Express yourself with quick emoji responses
- **Group Chats**: Create and manage multiple conversation groups
- **Channels**: Organize discussions by topic with dedicated channels
- **Voice & Video Calls**: High-quality audio and video communication
- **Screen Sharing**: Collaborate effectively with screen sharing capabilities
- **Customizable Themes**: Personalize your interface with theme options
- **Notification Settings**: Control how and when you receive alerts
- **Direct Messages**: Private conversations between users

## Technical Architecture

- **Frontend**: Built with React.js and styled using Tailwind CSS with Shadcn components
- **State Management**: React-Redux for efficient state handling
- **Real-Time Communications**: 
  - Socket.io for instant messaging and notifications
  - WebRTC for peer-to-peer voice and video calls
- **Backend**: Express and Node.js powering the API
- **Database**: MySQL for reliable data storage
- **Authentication**: Secured with Clerk

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/NaveedAfraz/EchoMate.git
   cd echomate
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   ```
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database
   ```
   npm run setup-db
   # or
   yarn setup-db
   ```

5. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

### Running Tests

```
npm run test
# or
yarn test
```

## Deployment

For production deployment:

```
npm run build
npm run start
# or
yarn build
yarn start
```

## Contributing

We welcome contributions to EchoMate! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on the GitHub repository.

---
