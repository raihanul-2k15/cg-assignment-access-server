# cg-assignment-access-server

This is a fun ExpressJS webserver that grants my classmates access to the Computer Graphics assignment solution app based on wheter or not they have starred some of my github repositories.

The code for solver app is at: https://github.com/raihanul-2k15/cg-assignment-solver-app

### How it works

First the person uses the front end app to rquest their solution. It then checks it's own db of allowed persons. If it can't find, then it checks the github repos through GitHub API. If it finds any new person who have starred all required repos, then he's granted access.

### What have been used

1. NodeJS
2. Express Webserver
3. GitHub API
4. SQLite Database

## How to use (if you're interested)

1. Install NodeJS
2. Fork or download this repo
3. Do `npm install`
4. Edit github.js and config.js files as necessary

The code is pretty small so you should be able to find what to change.

### Limitations
This webserver will make at least 1 request for each repo to GitHub API. But GitHub only allows **60** requests (as of now) in **1 hour** for a non OAuth'ed client. This in turn limits how many person can  request access to the assignment app (or whatever you've set up) in a given time.

You can make OAuth'ed calls to GitHub API (which allows **5000** requests per hour) but setting that up is a lot more pain.