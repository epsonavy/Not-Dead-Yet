## Upgrade Node.js due to some modules require Node.js > 0.6 version

Use the following instructions to upgrade Node.js version on a Mac.

Clear NPM's cache:

````sudo npm cache clean -f````

Install a little helper called ’n’:

````sudo npm install -g n````

Install latest stable Node.js version:

````sudo n stable````

## Install dependencies

````npm install````

## Database setup required

First, make sure MySQL datebase setting is correct in file Config.js (in root directory)

Run command line “node CreateDb.js” (in root directory)

### How to run

````npm start````
