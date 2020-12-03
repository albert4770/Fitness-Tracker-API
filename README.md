# fitnesstrackr
Fitness Tracker API, using node, express, and postgresql

## Getting Started
Install Packages

    npm i

Initialize Database

    createdb fitness-dev
    
Run Seed Script
    
    npm run seed:dev

## Automated Tests
Run the seed:dev npm script.

To run all the tests in watch mode (re-runs on code update), run

    npm run test:watch

### DB Methods


    npm run test:watch db.spec

### API Routes (server must be running for these to pass)

    npm run test:watch api.spec

