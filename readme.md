## Setting up OAuth

To enable OAuth for your application, follow these steps:

1. Open [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials).
2. Create New project
2. Create OAuth credentials, ensuring the **Authorized** and **Redirect Back URLs** match in the folder.
3. Download the JSON file and copy the `client_id` and `secret_id` to the backend's environment folder.
4. Add a testing email in the **OAuth Consent Screen**.
5. for any detail please see the picter step by step in oauthSettingFolder


### Application Setup

Choose either the traditional or Docker approach based on your preference. Adjust configurations as needed for your specific application.

### Traditional Setup

#### Frontend Setup

1. After cloning the project, navigate to the 'fe' directory.
2. Run `npm install` in the terminal (ensure **Node v.18** is used).
3. Execute `npm run dev` to start the frontend application.

#### Backend Setup

1. In the root folder, run `go mod tidy` to install dependencies.
2. Execute the following in the terminal:
   ```bash
   psql -U [username] -d [new_database_name] -f schema_dump.sql
   Replace [username] and [new_database_name] with your backend credentials.
3. Run the backend using go run main.go.

### Docker Setup
In the root folder, run docker-compose up in the terminal.
Wait for the process to finish.
This completes the setup process. 
