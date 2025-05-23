pipeline {
    agent any //

    environment {
        DEBUG_ENV = 'true'
        NEXT_PUBLIC_API_URL = credentials('next_public_api_url')
        NEXT_PUBLIC_CONTEXT_PATH = credentials('next_public_context_path')
        JWT_SECRET = credentials('jwt_secret')
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }
    }
}
