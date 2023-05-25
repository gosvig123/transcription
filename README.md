# Rinkel Transcription Service

Welcome to the Rinkel Transcription Service project! This project was developed as part of an interview for Rinkel. It is a simple transcription service that takes an audio file as input, processes it, and provides a text transcription of the audio. Some liberties were taken during the development, such as storing the uploaded audio files and adding the functionality to download the finished transcription. These features were added to enhance the user experience.

# Prerequisites

- Docker
- Node
- NPM

# Getting Started

To get the project up and running, follow these steps:

# Running with Docker

From the root folder, run the following commands:

1. Build the docker container:

```
docker-compose build
```

This command will create two Docker images, one for the client and one for the server.

2. Start the container:

```
docker-compose up
```

This command will run the Docker images and start the client and server.

# Running for Development

For development purposes, you can run the client and server separately using the following commands:

1. Run the client:

```
cd client
npm install
npm start
```

2. Run the server:

```
cd server
npm install
npm run dev
```

# What to improve

# Notification and Error Handling Improvements

In the current MVP version of our application, there are several opportunities to improve the user experience by enhancing the notification system and error handling mechanisms. Here are some suggested improvements.

1. **Job Status Notification**: To keep users informed about the progress of their transcription job, it would be useful to implement a notification system that provides updates on job status. This could include real-time notifications or periodic updates.

2. **Better Error Handling**: Given that this is an MVP, there is room for improvement in terms of error handling. By incorporating more robust error handling, the application can provide more accurate and informative feedback to users in case of issues or failures during the transcription process.

3. **Increasing Test Coverage**: To ensure the stability and reliability of the application, it is recommended to increase the amount of testing performed on the codebase. This includes implementing more unit, integration, and end-to-end tests, which will help identify and address potential issues more effectively.

These improvements can go a long way in making the application more robust, user-friendly, and reliable for its intended audience.
