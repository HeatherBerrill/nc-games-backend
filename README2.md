<h1> Heathers Games API </h1>

Heathers games API is hosted on heroku. Here is a link to the API...

https://nc-games-heather.herokuapp.com/api

This project is an application programming interface, created to access information from a games database. This is a backend project which is designed to be connected to a front end.

The end points aim to be clear and user friendly to help the client navigate the database easily and efficiently. Error handling has been implemented throughout to identify and reduce problems. <br>

<h2> Set-up Instructions </h2> <br>

<h3> Step1 - forking and cloning</h3>

<h4> Fork the project </h4>

from...

https://github.com/HeatherBerrill/be-nc-games

-- fork button in top right of repo screen

<h4> Clone project locally </h4>

- copy code from the green clone button

- cd into your chosen directory on your computer.

- in your terminal type git clone -- paste your copied link --

- you will need to remember your git username and password (this is the hardest bit).

- open project with vscode

<br> - - - - - - - - - - - - - - - - - - - - - - - - - - <br>

<h3> Step2 - Installing dependencies </h3>

- install dependencies by doing a general npm install
  -- this will install all modules listed as dependencies in the package.json.
- Check the following dependencies have been installed <br>

  -- dotenv <br>
  -- express <br>
  -- jest <br>
  -- pg <br>
  -- pg-format <br>
  -- jest-sorted <br>
  -- supertest <br>

  - If any have not been installed this can be done manually <br> -- npm install -package name-<br>

  - Don't worry if you are unsure whether they are installed or not. Installing them again will not cause issues, it will just update them.

  - Any dependencies which are dev dependencies need to be installed with a D <br>
    -- npm install -D -package name-
    <br>

<h4> This project has been created with node version 16.1.0 and postgres version 8.7.1. These are the minimum requirements needed to run the project. </h4> <br>
<br> - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
<h3> Step3 - Seed Local Database </h3>

Before beginning to work on the project you will need to setup and seed the local database. This will create the database and all the tables and insert the data. You will do this by running the setup and seeding scripts stated in the json file. <br>

-- npm run setup--<br>

-- npm run seed-- <br>
<br> - - - - - - - - - - - - - - - - - - - - - - - - - - <br>

<h3> Step4 - Create environment files </h3>

The testing and development environment files are not pushed up to github for security reasons. This means you will have to create them in your project.

In the route directory create a file called .env.test This then needs the code PGDATABASE= then the name of the database which can be found in the setup.sql file.

- the test environment file will need the database name then \_test at the end of it.

* the development environment file will need just the databse name.

* You need to ensure that your .gitignore file includes these files or .env.\* which will ignore all environment files regardless of their name.

<br> - - - - - - - - - - - - - - - - - - - - - - - - - - <br>

<h3> Step5 - Run test file </h3>

The test file needs to be run to check everything is working how it should. You should type
-- npm test app --

this will run the tests for the endpoints.

Enjoy :)
