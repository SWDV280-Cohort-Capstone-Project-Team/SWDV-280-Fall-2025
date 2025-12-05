## Final Project for CWI SWDV Program

## Overview

This repository contains the final project for the CWI SWDV program.  
It is a React application built with Vite and deployed using AWS Amplify.

## Scope of the Project

This project demonstrates:

- **Modern frontend development** with React and Vite
- **UI/UX design workflow** using Figma
- **Cloud-based deployment** and CI/CD with AWS Amplify
- **Source control** using Git and GitHub

## Frontend Tools

- **Figma**  
  We used Figma to design the UX/UI for the website.  
  **Link to our Figma files**: https://www.figma.com/design/eBmO2Rx3jHgtx3nl0LYsTS/CWI-Final-Collaborative-Project?node-id=1-8&t=0VYuoaIddc8nohoE-1

- **React**  
  We used React as our JavaScript framework for building the user interface.

- **Vite**  
  Vite is our web application bundler, dev server, and build tool.
  - **Dev server**: fast local development with HMR
  - **Build**: optimized production bundles

- **FlatIcon**  
  We used FlatIcon for icons throughout the site.  
  Especially an otter icon by William Richon, which has become our main mascot icon. (https://www.flaticon.com/free-icon/sea_12929510?term=otter&page=1&position=11&origin=search&related_id=12929510)

## Backend / DevOps Tools

- **Git & GitHub**  
  - Our `main` branch is used as the production branch.  
  - Anything pushed there is deployed to the live site through AWS Amplify’s CI/CD pipeline.

- **AWS Amplify**  
  We use AWS Amplify as our cloud environment for the live site. It manages:
  - CI/CD pipeline
  - DNS
  - Authentication
  - Database
  - Scheduling system

- **JetBrains AI Tool**  
  _Sayed please fill this out with details on how the tool was used._

## How to Run the Project Locally

From the project root:

```bash
npm install
npm run dev
```

This starts the Vite dev server. Follow the terminal output to open the app in your browser.

## AWS SSO / Team Access

- **AWS SSO**  
  _Add steps here for team members to log in via AWS SSO and access Amplify if needed._

