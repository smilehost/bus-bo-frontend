pipeline {
    agent any

    environment {
        DEBUG_ENV = 'true'
        NEXT_PUBLIC_API_URL = credentials('next_public_api_url')
        NEXT_PUBLIC_CONTEXT_PATH = credentials('next_public_context_path')
        JWT_SECRET = credentials('jwt_secret')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build and Run Docker') {
            steps {
                script {
                    // เขียน .env file ชั่วคราวเพื่อใช้ใน docker-compose
                    writeFile file: '.env', text: """
                    NEXT_PUBLIC_API_URL=${env.NEXT_PUBLIC_API_URL}
                    NEXT_PUBLIC_CONTEXT_PATH=${env.NEXT_PUBLIC_CONTEXT_PATH}
                    JWT_SECRET=${env.JWT_SECRET}
                    """
                }

                sh 'docker-compose down || true'  // กรณีรันซ้ำ
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'docker image prune -f || true'
        }
    }
}
