## Examination assignment 1, 2dv515
This is the assignment repo for the first assignment in the course 2dv515. 

## Installation
Make sure node.js 10 and npm is installed on your system.

1. `npm install`
2. `npm start`
3. `cd backend`
4. `npm install`
5. `npm start`
6. Browse to [http://localhost:3000](http://localhost:3000)

## Inspiration
MERN stack was used, but Mongo DB is currently not in use & connection steps commented out

1. [MERN tutorial.](https://medium.com/@beaucarnes/learn-the-mern-stack-by-building-an-exercise-tracker-mern-tutorial-59c13c1237a1)
2. [Express web framework (Node.js/JavaScript) tutorial.](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)
3. [Course lections.](http://coursepress.lnu.se/kurs/web-intelligence/files/2019/11/2.-Recommendation-Systems.pdf)

## Explanation
The main navigation is on the top navbar.

The client pages will retrieve full generated datasets from the server, i.e. not user-specific data.

Displaying of user-specific data is handled on client side by changing of React state.

Changing of user by select input will affect both tables.

Every table contains result limiter.
