#!/bin/bash

# Deployment script for Inspect Connect application
# Usage: ./scripts/deploy.sh [staging|production]

set -e

ENVIRONMENT=${1:-staging}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
VERSION=$(git rev-parse --short HEAD)

echo "🚀 Deploying Inspect Connect to $ENVIRONMENT environment"
echo "📅 Timestamp: $TIMESTAMP"
echo "🏷️  Version: $VERSION"

# Load environment-specific variables
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🔒 Loading production environment variables..."
    source .env.production
    DOCKER_TAG="latest"
    DEPLOY_URL="https://inspect-connect.com"
elif [ "$ENVIRONMENT" = "staging" ]; then
    echo "🧪 Loading staging environment variables..."
    source .env.staging
    DOCKER_TAG="staging"
    DEPLOY_URL="https://staging.inspect-connect.com"
else
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Build Docker images
echo "🔨 Building Docker images..."
docker build -t inspect-connect-frontend:$DOCKER_TAG ./client
docker build -t inspect-connect-backend:$DOCKER_TAG ./server

# Run tests
echo "🧪 Running tests..."
cd client && npm test
cd ../server && npm test
cd ..

# Security scan
echo "🔒 Running security scan..."
npm audit --audit-level moderate

# Deploy based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🚀 Deploying to production..."
    
    # Deploy to production (example with AWS ECS)
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
    
    docker tag inspect-connect-frontend:$DOCKER_TAG $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/inspect-connect-frontend:$VERSION
    docker tag inspect-connect-backend:$DOCKER_TAG $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/inspect-connect-backend:$VERSION
    
    docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/inspect-connect-frontend:$VERSION
    docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/inspect-connect-backend:$VERSION
    
    # Update ECS services
    aws ecs update-service --cluster inspect-connect-cluster --service frontend-service --force-new-deployment
    aws ecs update-service --cluster inspect-connect-cluster --service backend-service --force-new-deployment
    
elif [ "$ENVIRONMENT" = "staging" ]; then
    echo "🧪 Deploying to staging..."
    
    # Deploy to staging (example with Docker Compose)
    docker-compose -f docker-compose.staging.yml up -d --build
    
    # Health check
    echo "🏥 Running health checks..."
    sleep 30
    
    # Test endpoints
    curl -f http://localhost:5173 || exit 1
    curl -f http://localhost:5002/health || exit 1
    
    echo "✅ Staging deployment successful!"
fi

# Send notification
echo "📧 Sending deployment notification..."
curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"🚀 Inspect Connect deployed to $ENVIRONMENT environment (v$VERSION)\"}" \
  $SLACK_WEBHOOK_URL

echo "🎉 Deployment to $ENVIRONMENT completed successfully!"
echo "🌐 Application URL: $DEPLOY_URL"
echo "📊 Monitor at: $MONITORING_URL"
