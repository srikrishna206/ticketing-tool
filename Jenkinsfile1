pipeline {
    agent any

    environment {
        // Docker image names (update if hosted in DockerHub or ECR)
        ADMIN_IMAGE = 'ticketing-tool-new-admin:latest'
        FRONTEND_IMAGE = 'ticketing-tool-new-frontend:latest'
        BACKEND_IMAGE = 'ticketing-tool-new-backend:latest'
        POSTGRES_IMAGE = 'postgres:15'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📦 Checking out latest code from GitHub..."
                git branch: 'main', url: 'https://github.com/sandeepvilla1612/ticketing-tool.git'
            }
        }

        stage('Set up Environment') {
            steps {
                sh '''
                echo "🧩 Setting up environment variables..."
                if [ -f env.template ]; then
                    cp env.template .env
                    echo "✅ .env file created from env.template"
                else
                    echo "⚠️ No env.template found, skipping..."
                fi
                '''
            }
        }

        stage('Deploy New Containers') {
            steps {
                script {
                    sh '''
                    echo "🛑 Stopping and removing any old containers..."
                    docker ps -aq | xargs -r docker stop
                    docker ps -aq | xargs -r docker rm

                    echo "🧹 Removing old networks if exist..."
                    docker network rm ticketing-network || true

                    echo "🌐 Creating new Docker network..."
                    docker network create ticketing-network

                    echo "🐘 Starting PostgreSQL container..."
                    docker run -d --name postgres \
                        --network ticketing-network \
                        -e POSTGRES_USER=admin \
                        -e POSTGRES_PASSWORD=admin123 \
                        -e POSTGRES_DB=ticketingdb \
                        -p 5433:5432 \
                        -v pg_data:/var/lib/postgresql/data \
                        ${POSTGRES_IMAGE}

                    echo "⚙️ Starting Backend container..."
                    docker run -d --name backend \
                        --network ticketing-network \
                        -e DATABASE_URL=postgres://admin:admin123@postgres:5432/ticketingdb \
                        -p 8000:80 \
                        ${BACKEND_IMAGE}

                    echo "🖥️ Starting Frontend container..."
                    docker run -d --name frontend \
                        --network ticketing-network \
                        -e REACT_APP_API_URL=http://backend:3003 \
                        -p 3000:80 \
                        ${FRONTEND_IMAGE}

                    echo "🧑‍💼 Starting Admin container..."
                    docker run -d --name admin \
                        --network ticketing-network \
                        -e REACT_APP_API_URL=http://backend:3003 \
                        -p 3001:80 \
                        ${ADMIN_IMAGE}

                    echo "🚀 All containers started successfully!"
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                echo "🔍 Checking running containers..."
                docker ps

                echo "✅ Deployment verification complete!"
                '''
            }
        }
    }

    post {
        success {
            echo "🎉 Deployment successful! All containers are up and running."
        }
        failure {
            echo "❌ Deployment failed. Check the Jenkins console logs for errors."
        }
    }
}
