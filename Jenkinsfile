pipeline {
    agent any

    environment {
        DEBUG_ENV = 'true'
        NEXT_PUBLIC_API_URL = credentials('next_public_api_url')
        NEXT_PUBLIC_CONTEXT_PATH = credentials('next_public_context_path')
        JWT_SECRET = credentials('jwt_secret')
    }

    stages {
        stage('Print ENV values') {
            steps {
                echo "DEBUG_ENV = ${NEXT_PUBLIC_API_URL}"
                echo "NEXT_PUBLIC_API_URL = ${NEXT_PUBLIC_API_URL}"
                echo "NEXT_PUBLIC_CONTEXT_PATH = ${NEXT_PUBLIC_CONTEXT_PATH}"
                echo "JWT_SECRET = ${JWT_SECRET}"
            }
        }

        stage('Check ls') {
            steps {
                sh 'ls '
            }
        }
        stage('Check nginx.conf') {
            steps {
                sh 'ls -l ./nginx.conf || echo "❌ nginx.conf NOT FOUND in workspace"'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }
    }
}
