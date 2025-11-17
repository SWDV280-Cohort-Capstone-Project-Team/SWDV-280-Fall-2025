# Local Development Setup Guide

This guide will help you set up AWS Amplify for local development.

## Prerequisites

1. **AWS Account**: You need an AWS account to use Amplify
2. **AWS CLI**: Install and configure AWS CLI with your credentials
   ```bash
   # Install AWS CLI (if not already installed)
   # Then configure it:
   aws configure
   ```
   You'll need:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., `us-east-1`)
   - Default output format (e.g., `json`)

3. **Node.js**: Make sure you have Node.js installed (v18 or later recommended)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Amplify Sandbox

The Amplify sandbox creates a temporary cloud environment for local development. Run:

```bash
npm run amplify:sandbox
```

This command will:
- Deploy your backend resources (Auth, Data) to AWS
- Generate `amplify_outputs.json` file automatically
- Watch for changes and update the sandbox automatically
- Keep running until you stop it (Ctrl+C)

**Important**: Keep this terminal running while developing!

### 3. Start Your Development Server

In a **separate terminal**, start your Vite dev server:

```bash
npm run dev
```

Now your app should work with Amplify services!

## Available Scripts

- `npm run amplify:sandbox` - Start the Amplify sandbox (creates cloud resources)
- `npm run amplify:delete` - Delete the sandbox and clean up resources
- `npm run dev` - Start the Vite development server
- `npm run build` - Build for production

## Troubleshooting

### Error: "amplify_outputs.json not found"

**Solution**: Make sure you've started the sandbox first:
```bash
npm run amplify:sandbox
```

Wait for it to finish deploying, then the file will be generated automatically.

### Error: AWS Credentials Not Found

**Solution**: Configure AWS CLI:
```bash
aws configure
```

Or set environment variables:
```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1
```

### Error: Permission Denied

**Solution**: Make sure your AWS credentials have the necessary permissions for:
- CloudFormation
- IAM
- Cognito
- AppSync
- DynamoDB

### Sandbox Won't Start

**Solution**: 
1. Check your AWS credentials: `aws sts get-caller-identity`
2. Make sure you have sufficient AWS account permissions
3. Try deleting and recreating: `npm run amplify:delete` then `npm run amplify:sandbox`

### App Still Not Working

1. Make sure the sandbox is running (check the terminal)
2. Verify `amplify_outputs.json` exists in the project root
3. Check the browser console for specific error messages
4. Restart both the sandbox and dev server

## How It Works

1. **Sandbox**: Creates temporary AWS resources in your account
2. **amplify_outputs.json**: Contains configuration for your frontend to connect to those resources
3. **Your App**: Uses the configuration to authenticate and access data

## Cleanup

When you're done developing, you can clean up the sandbox resources:

```bash
npm run amplify:delete
```

This will remove all the temporary AWS resources created by the sandbox.

## Production Deployment

For production, you'll use a different deployment method (pipeline deployment). The sandbox is only for local development.





