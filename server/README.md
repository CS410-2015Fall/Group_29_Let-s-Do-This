# About server

This the Let's Do This backend server.  It is a Django application running on our remote droplet. The app can also be run on your machine's localhost, i.e. for development.

server manages the 'Let's Do This' database of Users and Events. Accessing database entities requires sending http requests (GET/POST/PUT/DELETE) to the server's API. Later this may require a key, SSL, and/or certificate for enhanced security.

In this readme:

1. Using the Remote API
	* Users
	* Events
		* Event Comments
		* Event ShoppingList
	* Events associated with Users
	* Server admin

See `for_developers.md` for developing/using the server locally and deploying to our live server.



# Using the Remote API

The following URLs can be accessed in the browser for more detailed documentation as well as GUI calls to requests, courtesy of the [Django REST Framework](http://www.django-rest-framework.org/).

For easier control of the headers sent with each request (i.e. for testing/peace of mind during client development), I recommend using cURL (http://curl.haxx.se/) or httpie (https://github.com/jkbrzt/httpie), though I have had trouble with JWT authentication using httpie.



## Users

All actions (except login) require an authentication token in the request header. This is obtained by successful login with any existing account's username and password.

| Action            | Url                                               | Url keys   | JSON keys                                     |
| ----------------- | ------------------------------------------------  | ---------- | --------------------------------------------- |
| **POST (login)**  | http://159.203.12.88/login/                       |            | username, password                            |
| **POST (create new user)**   | http://159.203.12.88/api/users/new/    |            | username, password, email, phone, friends     |
| POST              | http://159.203.12.88/api/users/search             |            | username                                      |
| GET all           | http://159.203.12.88/api/users/                   |            |                                               |
| GET               | http://159.203.12.88/api/users/2/                 | User id    |                                               |
| PUT               | http://159.203.12.88/api/users/2/                 | User id    | username, password, email, phone, friends     |
| DELETE            | http://159.203.12.88/api/users/2/                 | User id    |                                               |
| POST (rm friends) | http://159.203.12.88/api/users/2/friends/remove/  | User id    | friends (to remove)                           |

**friends** = list/array of other User IDs



## Events

All actions require an authentication token in the request header. This is obtained by successful login with any existing account's username and password.

| Action   | Url                                               | Url keys             | JSON keys                                     |
| -------- | ------------------------------------------------- | -------------------- | --------------------------------------------- |
| GET all  | http://159.203.12.88/api/events/                  |                      |                                               |
| POST     | http://159.203.12.88/api/events/                  |                      | display_name, start_date, end_date, budget, location, hosts, invites, accepts, declines    |
| GET      | http://159.203.12.88/api/events/42/                | Event id             |                                               |
| PUT      | http://159.203.12.88/api/events/42/                | Event id             | display_name, start_date, end_date, budget, location, hosts, invites, accepts, declines     |
| DELETE   | http://159.203.12.88/api/events/42/                | Event id             |                                               |
| POST     | http://159.203.12.88/api/events/42/invites/remove/ | Event id             | invites (to remove)                             |
| POST     | http://159.203.12.88/api/events/42/hosts/remove/   | Event id             | hosts (to remove)                             |
| POST     | http://159.203.12.88/api/events/42/changed/remove/ | Event id             | changed (user IDs to remove)                  |

**start_date, end_date** = UTC and in format `YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]`

**budget** = decimal amount, e.g. 12345678.90

**hosts, invites, accepts, declines** = list/array of User IDs



### Event Comments

| Action   | Url                                             | Url keys             | JSON keys                                     |
| -------- | ----------------------------------------------- | -------------------- | --------------------------------------------- |
| POST     | http://159.203.12.88/api/events/42/comments/     | Event id             | author (user id), post_date, content          |
| GET      | http://159.203.12.88/api/events/42/comments/     | Event id             |                                               |
| GET      | http://159.203.12.88/api/events/42/comments/5/   | Event id, Comment id |                                               |
| PUT      | http://159.203.12.88/api/events/42/comments/5/   | Event id, Comment id | author (user id), post_date, content          |
| DELETE   | http://159.203.12.88/api/events/42/comments/5/   | Event id, Comment id |                                               |



### Event ShoppingList

| Action   | Url                                                    | Url keys             | JSON keys                                     |
| -------- | ------------------------------------------------------ | -------------------- | --------------------------------------------- |
| GET      | http://159.203.12.88/api/events/42/shoppinglist/        | Event id             |                                               |
| POST     | http://159.203.12.88/api/events/42/shoppinglist/        | Event id             | display_name, quantity, cost, supplier, ready |
| PUT      | http://159.203.12.88/api/events/42/shoppinglist/edit/   | Event id             | display_name, quantity, cost, supplier, ready |
| POST     | http://159.203.12.88/api/events/42/shoppinglist/remove/ | Event id             | item_id                                       |
| GET      | http://159.203.12.88/api/events/42/shoppinglist/5/      | Event id, Item id    |                                               |
| PUT      | http://159.203.12.88/api/events/42/shoppinglist/5/      | Event id, Item id    | display_name, quantity, cost, supplier, ready |
| DELETE   | http://159.203.12.88/api/events/42/shoppinglist/5/      | Event id, Item id    |                                               |


### Event Polls

| Action   | Url                                                  | Url keys                     | JSON keys                                     |
| -------- | ---------------------------------------------------- | ---------------------------- | --------------------------------------------- |
| GET      | http://159.203.12.88/api/events/42/polls/            | Event id                     |                                               |
| POST     | http://159.203.12.88/api/events/42/polls/            | Event id                     | question, choices                             |
| GET      | http://159.203.12.88/api/events/42/polls/5/          | Event id, Poll id            |                                               |
| DELETE   | http://159.203.12.88/api/events/42/polls/5/          | Event id, Poll id            |                                               |
| POST     | http://159.203.12.88/api/events/42/polls/5/vote/     | Event id, Poll id,           | vote (id of choice)                           |


## Events associated with Users

All actions require an authentication token in the request header. This is obtained by successful login with any existing account's username and password.

| Action   | Url                                        | Url keys   | JSON keys             |
| -------- | ------------------------------------------ | ---------- | --------------------- |
| GET      | http://159.203.12.88/api/users/42/events/   | User id    |                       |
| PUT      | http://159.203.12.88/api/users/42/events/   | User id    | *not yet implemented* |



## Server Admin

Using the Django admin dashboard, you can inspect all existing model instances/objects, manage them, and create new ones. You will need an admin account created for you.

http://159.203.12.88/admin/
