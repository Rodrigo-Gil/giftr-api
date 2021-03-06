# Giftr APP API 

[![Netlify Status](https://api.netlify.com/api/v1/badges/3b2be409-af5c-4e13-995a-a068facb4e49/deploy-status)](https://app.netlify.com/sites/dreamy-panini-04f005/deploys)

A RESTful API web service using Node.js, Express, Mongoose and MongoDB. This proof of concept has the following features;

* The API supports basic registration, login and change password features;
* Each registered user can create a list of gifts for people they create;
* The user can add one or more gift ideas for their list of people;
* The people and their gift ideas can be shared with other users;
* The owner can view only it's people list and it's gift ideas;
* The API allow users to perform basic CRUD operations to <b>people</b> and <b>gifts</b>;

## Development Features

* JWT Tokens were utilized for authenticating and validating the user login;
* An x-api-key header is required when performing HTTP requests to the API;
* Express Middleware functions were used to simplify and streamline the development;
* All errors responses meet the JSON:API standards;
* All the user/client data is sanitized against XSS/Query injection attacks;


## API URL
https://dreamy-panini-04f005.netlify.app/
