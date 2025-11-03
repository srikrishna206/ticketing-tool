pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        // Your actual local image names (or replace with ECR/DockerHub if pushed)
        ADMIN_IMAGE = 'ticketing-tool-new-admin:latest'
        FRONTEND_IMAGE = 'ticketing-tool-new-frontend:latest'
        BACKEND_IMAGE = 'ticketing-tool-new-backend:latest'
        POSTGRES_IMAGE = 'postgres:15'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/sandeepvilla1612/ticketing-tool.git'
            }
        }

        stage('Set up Environment') {
            steps {
                sh '''
                echo "Setting up environment variables..."
                if [ -f env.template ]; then
                    cp env.template .env
                else
                    echo "No env.template found, skipping copy..."
                fi
                '''
            }
        }

        stage('Deploy Using Docker Compose') {
            steps {
                script {
                    sh '''
                    echo "Creating docker-compose.yml dynamically..."

                    cat > docker-compose.yml <<EOF
                    version: '3.8'

                    services:
                      postgres:
                        image: ${POSTGRES_IMAGE}
                        container_name: postgres
                        restart: always
                        environment:
                          POSTGRES_USER: admin
                          POSTGRES_PASSWORD: admin123
                          POSTGRES_DB: ticketingdb
                        ports:
                          - "5432:5432"
                        volumes:
                          - pg_data:/var/lib/postgresql/data

                      backend:
                        image: ${BACKEND_IMAGE}
                        container_name: backend
                        restart: always
                        depends_on:
                          - postgres
                        environment:
                          DATABASE_URL: postgres://admin:admin123@postgres:5432/ticketingdb
                        ports:
                          - "8000:8000"

                      frontend:
                        image: ${FRONTEND_IMAGE}
                        container_name: frontend
                        restart: always
                        depends_on:
                          - backend
                        ports:
                          - "3000:3000"

                      admin:
                        image: ${ADMIN_IMAGE}
                        container_name: admin
                        restart: always
                        depends_on:
                          - backend
                        ports:
                          - "4000:4000"

                    volumes:
                      pg_data:
                    EOF

                    echo "Stopping old containers..."
                    docker compose down || true

                    echo "Starting new containers..."
                    docker compose up -d

                    echo "Deployment completed!"
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                echo "Verifying running containers..."
                docker ps
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Deployment failed. Please check Jenkins logs."
        }
    }
}
