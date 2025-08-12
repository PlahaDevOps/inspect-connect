# CI/CD Pipeline Setup for Inspect Connect

## Overview
This document describes the simplified CI/CD pipeline setup for the Inspect Connect application using Azure DevOps.

## Pipeline Structure

### 1. Build Stage
- **Frontend Build**: Builds the React application
- **Backend Build**: Builds the Node.js/Express server
- **Testing**: Runs linting and tests (non-blocking)
- **Artifact Publishing**: Saves build artifacts for deployment

### 2. Docker Stage
- **Client Image**: Builds and pushes the frontend Docker image
- **Server Image**: Builds and pushes the backend Docker image
- **Registry**: Uses Azure Container Registry (ACR)

### 3. Deploy Stage
- **Test Environment**: Deploys to a test environment
- **Health Checks**: Verifies deployment success

### 4. Notify Stage
- **Status Notifications**: Sends pipeline status updates

## Prerequisites

### Azure DevOps Setup
1. **Create Azure DevOps Project**
   - Go to [Azure DevOps](https://dev.azure.com)
   - Create a new project for Inspect Connect

2. **Set up Service Connections**
   - **Azure Container Registry (ACR)**
     - Go to Project Settings → Service Connections
     - Create new service connection for Azure Container Registry
     - Name it: `inspect-connect-acr-connection`

3. **Create Environment**
   - Go to Pipelines → Environments
   - Create environment: `test-environment`

### Azure Resources
1. **Azure Container Registry (ACR)**
   ```bash
   # Create ACR
   az acr create --name inspectconnectregistry --resource-group your-rg --sku Basic
   ```

2. **Test Environment** (Choose one):
   - **Azure App Service**: For simple web apps
   - **Azure Kubernetes Service (AKS)**: For containerized apps
   - **Azure Container Instances**: For simple container deployment

## Configuration

### 1. Update Pipeline Variables
Edit `azure-pipelines-simple.yml`:
```yaml
variables:
  dockerRegistry: 'your-registry.azurecr.io'  # Your ACR name
```

### 2. Environment Variables
Set these in Azure DevOps Pipeline Variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Your JWT secret
- `SENDGRID_API_KEY`: Your SendGrid API key
- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### 3. Service Connection Names
Update these in the pipeline:
```yaml
containerRegistry: 'inspect-connect-acr-connection'  # Your ACR service connection name
environment: 'test-environment'           # Your environment name
```

## Pipeline Triggers

The pipeline triggers on:
- **Branches**: `main`, `develop`
- **Paths**: Changes in `client/`, `server/`, or pipeline file

## Manual Setup Steps

### 1. Import Pipeline
1. Go to Azure DevOps → Pipelines
2. Click "New Pipeline"
3. Choose "Azure Repos Git" (or your source)
4. Select your repository
5. Choose "Existing Azure Pipelines YAML file"
6. Select `azure-pipelines-simple.yml`

### 2. Configure Variables
1. Go to Pipeline → Edit → Variables
2. Add all environment variables listed above
3. Mark sensitive variables as "Secret"

### 3. Set up Environment
1. Go to Pipelines → Environments
2. Create `test-environment`
3. Add approval gates if needed

## Testing the Pipeline

### 1. First Run
```bash
# Make a small change and push
git add .
git commit -m "Test CI/CD pipeline"
git push
```

### 2. Monitor Pipeline
- Go to Azure DevOps → Pipelines
- Watch the pipeline execution
- Check logs for any issues

### 3. Verify Deployment
- Check your test environment
- Verify both frontend and backend are running
- Test API endpoints

## Troubleshooting

### Common Issues
1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript compilation errors

2. **Docker Build Failures**
   - Verify Dockerfile syntax
   - Check if all required files are present
   - Ensure ACR service connection is working

3. **Deployment Failures**
   - Check environment configuration
   - Verify service connections
   - Check resource permissions

### Debug Steps
1. **Enable Debug Logging**
   - Set `system.debug` to `true` in pipeline variables

2. **Check Service Connections**
   - Verify ACR connection is working
   - Test environment access

3. **Review Logs**
   - Check detailed logs in each stage
   - Look for specific error messages

## Next Steps

### Production Pipeline
Once the simplified pipeline is working, we can create a production version with:
- **Multi-environment deployment** (dev, staging, prod)
- **Approval gates** for production deployments
- **Advanced security scanning**
- **Performance testing**
- **Rollback capabilities**

### Monitoring and Alerts
- Set up application monitoring
- Configure alerting for failures
- Add performance metrics

## Support

For issues with the pipeline:
1. Check the troubleshooting section above
2. Review Azure DevOps documentation
3. Check pipeline logs for specific errors
