pipeline {
    agent any

    environment {
        REPO_NAME = "ticketing-tool"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📦 Checking out the source code..."
                git branch: 'main', url: 'https://github.com/srikrishna206/ticketing-tool.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "🐳 Building Docker images locally..."
                    sh 'docker build -t ${REPO_NAME}-backend:latest ./backend'
                    sh 'docker build -t ${REPO_NAME}-frontend:latest ./frontend'
                    sh 'docker build -t ${REPO_NAME}-admin:latest ./admin'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo "🚀 Deploying containers using Docker Compose..."
                    sh '''
                    docker-compose down
                    docker-compose up -d --build
                    docker ps
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "🧹 Cleaning up unused Docker resources..."
            sh 'docker system prune -f'
        }
        success {
            echo "✅ Deployment successful! Application is running."
        }
        failure {
            echo "❌ Deployment failed. Check the logs above."
        }
    }
}
