# Self-Hosted Azure DevOps Agent Setup Guide

## Overview
This guide will help you set up a self-hosted agent to avoid the hosted parallelism limits in Azure DevOps.

## Prerequisites
- macOS (you're on Darwin 23.4.0)
- Node.js 20.x (already installed)
- Git (already installed)
- Azure CLI (already installed)

## Step 1: Create Agent Pool in Azure DevOps

### 1.1 Go to Azure DevOps Project Settings
1. Open your Azure DevOps project
2. Click **Project Settings** (bottom left)
3. Click **Agent pools** under Pipelines

### 1.2 Create New Pool
1. Click **Add pool**
2. Select **Self-hosted**
3. Name it: `inspect-connect-agents`
4. Click **Create**

## Step 2: Download and Configure Agent

### 2.1 Download Agent
```bash
# Create agent directory
mkdir ~/azure-agent
cd ~/azure-agent

# Download agent (try this URL)
curl -O https://vstsagentpackage.azureedge.net/agent/3.242.0/vsts-agent-osx-x64-3.242.0.tar.gz

# If that fails, try the latest version
curl -O https://vstsagentpackage.azureedge.net/agent/latest/vsts-agent-osx-x64.tar.gz
```

### 2.2 Extract Agent
```bash
tar zxvf vsts-agent-osx-x64-*.tar.gz
```

### 2.3 Configure Agent
```bash
./config.sh
```

**Configuration Options:**
- **Server URL**: `https://dev.azure.com/PlahaDevOps`
- **Authentication type**: `PAT` (Personal Access Token)
- **Token**: [You'll need to create a PAT]
- **Agent pool**: `inspect-connect-agents`
- **Agent name**: `inspect-connect-mac-agent`
- **Work folder**: `_work` (default)

## Step 3: Create Personal Access Token (PAT)

### 3.1 Generate PAT
1. Go to Azure DevOps → User Settings (top right)
2. Click **Personal access tokens**
3. Click **New Token**
4. **Name**: `Agent Token`
5. **Organization**: `PlahaDevOps`
6. **Scopes**: 
   - ✅ **Agent Pools** (Read & manage)
   - ✅ **Code** (Read)
   - ✅ **Build** (Read & execute)
7. Click **Create**
8. **Copy the token** (you'll need it for agent config)

## Step 4: Install and Start Agent

### 4.1 Install as Service
```bash
# Install as macOS service
sudo ./svc.sh install
sudo ./svc.sh start
```

### 4.2 Or Run Manually
```bash
# Run manually (for testing)
./run.sh
```

## Step 5: Update Pipeline to Use Self-Hosted Agent

### 5.1 Update Pipeline YAML
Replace the pool section in your pipeline:

```yaml
pool:
  name: 'inspect-connect-agents'  # Your self-hosted pool
  demands:
  - agent.name -equals inspect-connect-mac-agent
```

### 5.2 Complete Updated Pipeline
```yaml
# Self-hosted agent pipeline
trigger:
  branches:
    include:
    - main
  paths:
    include:
    - client/*
    - server/*
    - azure-pipelines-self-hosted.yml

variables:
  nodeVersion: '20.x'

stages:
- stage: BuildAndDeploy
  displayName: 'Build and Deploy'
  jobs:
  - job: BuildAndDeployAll
    displayName: 'Build and Deploy Everything'
    pool:
      name: 'inspect-connect-agents'
      demands:
      - agent.name -equals inspect-connect-mac-agent
    
    steps:
    # Install Node.js
    - task: NodeTool@0
      inputs:
        versionSpec: $(nodeVersion)
      displayName: 'Install Node.js'
    
    # Build Frontend
    - script: |
        echo "Building Frontend..."
        cd client
        npm ci
        npm run build
      displayName: 'Build Frontend'
    
    # Build Backend
    - script: |
        echo "Building Backend..."
        cd ../server
        npm ci
        npm run build
      displayName: 'Build Backend'
    
    # Deploy Frontend
    - task: AzureWebApp@1
      inputs:
        azureSubscription: 'inspect-connect-acr'
        appName: 'inspect-connect-test'
        package: '$(System.DefaultWorkingDirectory)/client/dist'
        appSettings: |
          -VITE_API_URL https://inspect-connect-api-test-bgb3gea5c0ezfkfe.canadacentral-01.azurewebsites.net
      displayName: 'Deploy Frontend to App Service'
    
    # Deploy Backend
    - task: AzureWebApp@1
      inputs:
        azureSubscription: 'inspect-connect-acr'
        appName: 'inspect-connect-api-test'
        package: '$(System.DefaultWorkingDirectory)/server/dist'
        appSettings: |
          -MONGODB_URI $(MONGODB_URI)
          -JWT_SECRET $(JWT_SECRET)
          -SENDGRID_API_KEY $(SENDGRID_API_KEY)
          -TWILIO_ACCOUNT_SID $(TWILIO_ACCOUNT_SID)
          -TWILIO_AUTH_TOKEN $(TWILIO_AUTH_TOKEN)
          -CLOUDINARY_CLOUD_NAME $(CLOUDINARY_CLOUD_NAME)
          -CLOUDINARY_API_KEY $(CLOUDINARY_API_KEY)
          -CLOUDINARY_API_SECRET $(CLOUDINARY_API_SECRET)
      displayName: 'Deploy Backend to App Service'
    
    # Success Message
    - script: |
        echo "✅ Pipeline completed successfully!"
        echo "Frontend URL: https://inspect-connect-test-fyanc3gpfacngbau.canadacentral-01.azurewebsites.net"
        echo "Backend URL: https://inspect-connect-api-test-bgb3gea5c0ezfkfe.canadacentral-01.azurewebsites.net"
      displayName: 'Pipeline Status and URLs'
```

## Step 6: Test the Setup

### 6.1 Verify Agent is Running
1. Go to Project Settings → Agent pools
2. Click on `inspect-connect-agents`
3. Verify your agent shows as "Online"

### 6.2 Run Pipeline
1. Update your pipeline with the new YAML
2. Run the pipeline
3. Monitor the agent logs

## Troubleshooting

### Agent Won't Start
```bash
# Check agent status
./svc.sh status

# View logs
tail -f _diag/*.log
```

### Permission Issues
```bash
# Fix permissions
chmod +x *.sh
```

### Network Issues
- Ensure your machine can reach `dev.azure.com`
- Check firewall settings
- Verify PAT token is correct

## Benefits of Self-Hosted Agent

✅ **No parallelism limits**
✅ **Faster builds** (local resources)
✅ **Full control** over environment
✅ **Cost effective** for development
✅ **Custom tools** and dependencies

## Next Steps

1. Create the agent pool in Azure DevOps
2. Generate a PAT token
3. Download and configure the agent
4. Update your pipeline YAML
5. Test the setup

Would you like me to help you with any specific step?
