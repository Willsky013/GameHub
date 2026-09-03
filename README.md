# 🎮 GameHub

GameHub is a full-stack web gaming platform built as a project to practice and demonstrate modern web development using **React, TypeScript, ASP.NET Core, C#, Entity Framework Core, and SQL Server**.

The goal of GameHub is to provide a central place where users can browse and play games, create an account, save their scores, and compete on leaderboards.

## ✨ Features

* 🎮 **Game Library**

  * Browse available games
  * View game information and artwork
  * Launch games directly from the GameHub

* 👤 **User Accounts**

  * Register a new account
  * Log in and log out
  * User authentication using ASP.NET Core Identity
  * Profile information and display name

* 🏆 **Scores & Leaderboards**

  * Save scores from supported games
  * Track personal high scores
  * Compare scores with other players
  * Game-specific leaderboards

* 🕹️ **Playable Games**

  * Games are implemented directly into the GameHub client
  * Current game development includes **Snake**
  * Games use reusable game components and rendering logic

* 🎨 **Game UI**

  * Custom game artwork and pixel-art assets
  * Arcade-style game cards
  * Custom game-over screens
  * Responsive React components

## 🛠️ Technologies

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **React Router**
* **CSS**

### Backend

* **ASP.NET Core Web API**
* **C#**
* **Entity Framework Core**
* **ASP.NET Core Identity**
* **SQL Server**

### Development Tools

* Visual Studio / Visual Studio Code
* Git & GitHub
* npm
* .NET SDK

## 📁 Project Structure

GameHub/
│
├── GameHub.Server/
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Services/
│   └── ...
│
├── gamehub.client/
│   ├── src/
│   │   ├── components/
│   │   ├── games/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── ...
│   └── ...
│
├── GameHub.slnx
└── README.md

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [.NET SDK](https://dotnet.microsoft.com/)
* [Node.js](https://nodejs.org/)
* [SQL Server](https://www.microsoft.com/sql-server)
* Git

### 1. Clone the repository

git clone https://github.com/Willsky013/GameHub.git
cd GameHub

### 2. Set up the database

The backend uses **Entity Framework Core** with SQL Server.

Configure the database connection string in:

GameHub.Server/appsettings.json

Example:
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=GameHub;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}

Then apply the Entity Framework migrations:

dotnet ef database update

### 3. Start the backend

Navigate to the server project:

cd GameHub.Server

Run the API:

dotnet run

### 4. Start the frontend

Open another terminal and navigate to the client:

cd gamehub.client

Install the dependencies:

npm install

Start the Vite development server:

npm run dev

The frontend will then be available at the local address shown by Vite.

## 🎮 Games

### Snake

Snake is one of the games currently implemented in GameHub.

The game includes:

* Grid-based movement
* Keyboard controls
* Food and scoring
* Snake body growth
* Collision detection
* High-score saving
* Game-over screen
* Custom pixel-art graphics

The game is structured so that the game logic and rendering are separated, making it easier to add or replace graphical assets in the future.

## 🔐 Authentication

GameHub uses **ASP.NET Core Identity** for user authentication.

Users can:

1. Create an account
2. Log in
3. Play games
4. Submit their scores
5. View their personal high scores
6. Compare their scores on leaderboards

Authentication state is handled on the React side through an authentication context and custom hooks.

## 🏗️ Architecture

GameHub is split into two main applications:

┌─────────────────────┐
│   React Frontend    │
│                     │
│  TypeScript + Vite  │
└──────────┬──────────┘
           │
           │ HTTP API
           ▼
┌─────────────────────┐
│   ASP.NET Core API  │
│                     │
│ C# + EF Core        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      SQL Server     │
│                     │
│ Users / Games /     │
│ Scores              │
└─────────────────────┘

The frontend communicates with the ASP.NET Core API for things such as:

* Authentication
* Game information
* User information
* Score submission
* Leaderboards

## 📊 Database

The application uses Entity Framework Core to manage the database.

The main entities include:

### ApplicationUser

Stores information about registered users and is based on ASP.NET Core Identity.

### Game

Stores information about games available on GameHub.

### Score

Stores scores achieved by users in individual games.

A simplified relationship looks like:

ApplicationUser
      │
      │ 1
      │
      │ *
    Score
      │
      │ *
      │
      │ 1
     Game

## 🔮 Future Plans

GameHub is an ongoing project. Planned improvements include:

* 🎮 More playable games
* 🏆 Improved global leaderboards
* 👤 Expanded user profiles
* 🎨 More custom game artwork
* 📱 Improved mobile support
* ⚙️ Better game management
* 🔊 Sound effects and music
* ✨ Additional UI animations
* 🧪 More testing
* 🚀 Production deployment

## 📚 What I Am Learning

This project is being developed as a way to gain practical experience with full-stack web development.

The project covers:

* React component architecture
* TypeScript
* State management
* React routing
* REST APIs
* ASP.NET Core Web API
* C#
* Entity Framework Core
* SQL Server
* Authentication and authorization
* Database migrations
* Git and GitHub
* Frontend/backend communication
* Game development with JavaScript/TypeScript

## 👨‍💻 Author

**William Falk Bengtsson**

GitHub: [Willsky013](https://github.com/Willsky013)

## 📄 License

This project is currently a personal/educational project.
