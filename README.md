This is a course project

Installation

prerequisites:
node.js (tested on version 20.15.0)
npm

To install:
1.	clone repository
2.	run “npm run preinstall”
3.	run “npm run install”
4.	set “SECRET” in “./server/.env” to a random string

To run production:
1.	set “NODE_ENV=production” in “./server/.env”
2.	run “npm run build”
3.	run “npm start”
4.	open a browser and navigate to “localhost:1234”

To run development:
1.	set “NODE_ENV=development” in “./server/.env”
2.	run “npm run dev:server”
3.	run “npm run dev:client” in another command line instance
4.	a browser should open to localhost:3000
