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
                    echo "🐳 Building Docker images locally (with caching)..."
                    // Added cache-aware Docker builds
                    sh '''
                    docker build --cache-from ${REPO_NAME}-backend:latest -t ${REPO_NAME}-backend:latest ./backend
                    docker build --cache-from ${REPO_NAME}-frontend:latest -t ${REPO_NAME}-frontend:latest ./frontend
                    docker build --cache-from ${REPO_NAME}-admin:latest -t ${REPO_NAME}-admin:latest ./admin
                    '''
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo "🚀 Deploying containers using Docker Compose..."

                    // Added Docker Compose cleanup and redeploy steps
                    sh '''
                    echo "🛑 Stopping and removing old containers..."
                    docker compose down -v --remove-orphans || true

                    echo "🧹 Removing unused networks..."
                    docker network prune -f || true

                    echo "🚀 Starting new containers..."
                    docker compose up -d --build

                    echo "📋 Running containers list:"
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
