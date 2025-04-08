# Deployment Instructions for AutoCad Buddy

This document provides step-by-step instructions for deploying the AutoCad Buddy application to Render.

## Prerequisites

- A Render account (free tier is sufficient)
- A GitHub account (to host your code repository)

## Step 1: Create a GitHub Repository

1. Log in to your GitHub account
2. Click on the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "autocad-buddy")
4. Choose "Public" or "Private" visibility
5. Click "Create repository"
6. Upload all the files from the deployment package to this repository

## Step 2: Deploy to Render

1. Log in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your GitHub account if you haven't already
4. Select the repository you created in Step 1
5. Configure the following settings:
   - **Name**: autocad-buddy (or your preferred name)
   - **Environment**: Python
   - **Region**: Choose the region closest to your users
   - **Branch**: main (or your default branch)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
6. Click "Create Web Service"

## Step 3: Environment Variables (Optional)

For enhanced security, you can set the following environment variables in your Render dashboard:

1. Go to your web service dashboard
2. Click on "Environment" in the left sidebar
3. Add the following environment variable:
   - **Key**: JWT_SECRET_KEY
   - **Value**: [Generate a secure random string]
4. Click "Save Changes"

## Step 4: Verify Deployment

1. Wait for the deployment to complete (this may take a few minutes)
2. Once deployed, Render will provide a URL for your application (e.g., https://autocad-buddy.onrender.com)
3. Visit this URL to verify that your application is running
4. Test the API by visiting the test endpoint: https://your-app-url.onrender.com/api/test
   - You should see: `{"message":"AutoCad_Buddy API is running"}`

## Step 5: Connect Frontend to Backend

If you're deploying the frontend separately:

1. Update the API_URL variable in your frontend code to point to your Render backend URL
2. Deploy your frontend to your preferred hosting service

## Troubleshooting

If you encounter any issues:

1. Check the Render logs for error messages
2. Verify that all files were uploaded correctly to GitHub
3. Ensure the Start Command is set to `gunicorn app:app`
4. Check that the requirements.txt file includes all necessary dependencies

## Next Steps

Once your application is deployed:

1. Set up a custom domain (optional)
2. Implement a proper database instead of the in-memory storage
3. Add more features to your application
