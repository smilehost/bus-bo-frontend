pipeline {
    agent any
    
    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }
    }
}
