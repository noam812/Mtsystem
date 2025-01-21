# Message Template Manager

A full-stack application for managing message templates with Telegram bot integration.
improvements that were made was adding openai gpt-4 to enhance ux with bot integration. 
+ started to integrate cicd pipeline.

## 🚀 Tech Stack

* **Frontend:** React
* **Backend:** Node.js/Express
* **Database:** MongoDB
* **Bot:** Telegram API
* **CI/CD:** GitHub Actions
* **Containerization:** Docker

## 📋 Prerequisites

* **Node.js:** 18+
* **Docker & Docker Compose**
* **MongoDB Instance**
* **Telegram Bot Token**
* **OpenAI API Key**

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mtsystem.git
cd mtsystem
```

### 2. Environment Setup

Create a [.env](vscode-file://vscode-app/c:/Users/Noam8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) file in the root directory:

```bash
**MONGODB_URI=your_mongodb_connection_string**

**TELEGRAM_BOT_TOKEN=your_telegram_bot_token**

**OPENAI_API_KEY=your_openai_api_key**
```

### 3. Install Dependencies

```
span
```

### 4. Run Development Servers

Open two terminal windows or tabs.

```
# Terminal 1: Start Server
cd server
npm run dev
```

```
span
```

**Terminal 2: Start Client**

**cd** **client**

**npm** **start**

The application should now be running:

* **Client:** `http://localhost:3000`
* **Server:** `http://localhost:5000`



## 📱 How to Use in Development Mode

### 1. Access the Client Application

* Open your browser and navigate to `http://localhost:3000`.
* You will see the Message Template Manager interface.

### 2. Add Templates with Context

* **Create a New Template:**
  * Click on the "Add Template" button.
  * Fill in the **Name** and **Context** fields.
    * **Name:** A descriptive name for the template (e.g., "Book Recommendation").
    * **Context:** A keyword or phrase related to the template (e.g., "books").
  * Submit the form to save the template.
* **Manage Existing Templates:**
  * View the list of existing templates.
  * Edit or delete templates as needed using the provided buttons.

### 3. Interact with the Telegram Bot

* **Start the Bot:**
  * Open Telegram and search for your bot using its username.
  * Click on **Start** to begin interacting with the bot.
  * **Command:** `/start`
    * **Response:** "Welcome to the Template Bot!"
* **View Available Commands:**
  * **Command:** `/templates`
    * **Response:** Displays a list of all available templates with their names and contexts.
* **Retrieve a Template Using Context:**
  * Send a regular message that matches a template's context.
    * **Example Message:** "I'm looking for a template related to books."
    * **Response:** The bot will return the corresponding template if a matching context is found.
* **Example Workflow:**
  1. **Add a Template:**
     * **Name:** Book Recommendation
     * **Context:** books
  2. **Use the Bot:**
     * **Command:** `/templates`
       * **Bot Response:**

         **Available Templates:**

         **- Book Recommendation: Here is a great book for yo**u...
     * **Message:** "I'm looking for a template related to books."
       * **Bot Response:** "Here is a great book for you: [Book Details]"

### 4. Testing the Bot and API

* Ensure that the server is running and connected to MongoDB.
* Use the client application to add, view, edit, and delete templates.
* Interact with the Telegram bot to retrieve templates based on context.
* Verify that templates are correctly returned and managed.

## 🐳 Docker Setup

### 1. Create Environment File

Ensure you have a [.env](vscode-file://vscode-app/c:/Users/Noam8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
```

### 2. Update [docker-compose.yml](vscode-file://vscode-app/c:/Users/Noam8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

Ensure your [docker-compose.yml](vscode-file://vscode-app/c:/Users/Noam8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) includes the necessary environment variables:

```
version: '3.8'

services:
  client:
    build: ./client
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - server

  server:
    build: ./server
    ports:
      - "5000:5000"
    env_file:
      - .env
    environment:
      - PORT=5000
```

### 3. Build and Run Containers

```
docker-compose up --build

```

**\**The application should now be accessible at:

* **Client:** `http://localhost:3000`
* **Server:** `http://localhost:5000`

## 🚢 Deployment

### 1. Setup GitHub Secrets

Add the following secrets to your GitHub repository:

* `DOCKER_HUB_USERNAME`
* `DOCKER_HUB_TOKEN`
* `MONGODB_URI`
* `TELEGRAM_BOT_TOKEN`
* `OPENAI_API_KEY`

### 2. Push to Main Branch

Pushing to the `main` branch will trigger the CI/CD pipeline:

```
git add .
git commit -m "Set up CI/CD pipeline"
git push origin main

```

## 🔧 Project Structure

**mtsystem/**

**├── client/                 # React frontend**

**│   ├── src/**

**│   │   ├── components/     # React components**

**│   │   ├── services/       # API services**

**│   │   └── context/        # React context**

**│   └── Dockerfile**

**├── server/                 # Node.js backend**

**│   ├── routes/             # API routes**

**│   ├── models/             # MongoDB models**

**│   └── Dockerfile**

**├── .github/**

**│   └── workflows/          # GitHub Actions**

**├── docker-compose.yml**

**└── README.md**

## 📱 Features

* **CRUD Operations:** Create, read, update, delete message templates
* **Telegram Bot Integration**
* **OpenAI Integration**
* **Docker Containerization**
* **Automated CI/CD Pipeline**

## 🛟 Troubleshooting

### Common Issues

#### 1. Docker Connection Refused

**docker-compose** **down**

**docker-compose** **up** **--build**

#### 2. MongoDB Connection Issues

* Verify the `MONGODB_URI` in [.env](vscode-file://vscode-app/c:/Users/Noam8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
* Check network connectivity
* Ensure MongoDB instance is running

### Logs

* **Client:** `docker logs mtsystem-client`
* **Server:** `docker logs mtsystem-server`
