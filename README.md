# Attendance


Attendance is a chat bot application which allows employees to take a day off in an easy and comfortable way.
The goal of this project is automating that process.

## Run the app:

Clone repository and use node and npm versions in package.json file, install them if not already installed.


1. `npm install`
2. `npm run start-locally`


Emulator must be running in the separate terminal.
[Download, build and run Bot-framework emulator] 
(https://github.com/Microsoft/BotFramework-Emulator/releases1)
The easiest way is to simply load Source code (tar.gz)
and build it with the following steps:

1. `npm install`
2. `npm run build`
3. `npm run start`

The next thing that should be done is putting app ID and password into emulator window
  appId: "607b6eb5-3eb4-4f2d-a0e9-38b471a4979a"
  appPassword: "9Yhoxk9oJyqo18Xog1hT4sH"

![alt tag](1.png)



## basic workflow:

We use BDD methodology while developing the app.
(https://www.toptal.com/freelance/your-boss-won-t-appreciate-tdd-try-bdd)

Make sure you follow eslint rules
(http://eslint.org/docs/rules/)

Commits with eslint errors are disabled.

When you are assigned on the new task:
1. Create separate branch. The name of the branch should appropriate a task meaining.
2. When you all done with a task create PR. Left the comment with a task description or link to task. And ask other developers
to test it.
3. Every task should have tests covering.
4. Approved PR is merged to master.


## writing tests
We use mocha as a test runner and chai assertion library.
Take a look at the following resources: 
1. https://blog.risingstack.com/node-hero-node-js-unit-testing-tutorial/
2. https://mochajs.org/
3. http://chaijs.com/

## Deploy Attandance app to Heroku:
1. `npm run build`
2. `git push heroku master`
