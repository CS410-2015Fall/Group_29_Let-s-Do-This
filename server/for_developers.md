# Developer Info & Local Setup

In this guide:

* Why Django?
* Requirements
* Setup
	* Python 'Virtual' Environment
	* PostgreSQL database
	* Using localhost server in development
	* Running Django unit tests
	* Deploying to Droplet/Production server

See README.md for general information and using the API.



# Why Django?

This is one of the fastest options for deployment. We are allowed to use any language & framework for backend server. Django is a popular Python web application framework and, as such, DigitalOcean offers a 'one-click' install of Django on one of their droplet servers and cheap hosting.  The DigitalOcean Community also contains several tutorials on how to work with their Ubuntu, Nginx, PostgreSQL, Gunicorn, Python, and Django web stack. Django's behaviour also abstracts away the web stack.

Django is quite bulky in terms of all its features + additional frameworks and seems like overkill for a database + API. But they install relatively quickly and are useful, such as the REST framework.

This application runs on **Django 1.8.3**.



# Requirements

* Python 2.7 (https://www.python.org/downloads/release/python-2710/)
* pip (https://pip.pypa.io/en/stable/installing/#install-pip)
* virtualenv (https://virtualenv.pypa.io/en/latest/installation.html)
* PostgreSQL (http://www.postgresql.org/download/)
* cURL (http://curl.haxx.se/) or httpie (https://github.com/jkbrzt/httpie), though I have had trouble with JWT authentication using httpie.



# Setup

## Python 'Virtual' Environment

It's not a good idea to move a Python virtual environment between computers, so I ask that you first set up your own in order to run server on your machine, after you've cloned/pulled from Github.

Using Terminal/Command Line, navigate to this server folder.  Create a Python virtual environment using  `virtualenv venv`  I'm on Windows and have found that I usually need to drag virtualenv.exe from C:\Python27\Scripts into the Command Line, followed by typing `venv`, then Enter.

Test that new Python venv works by activating then deactivating it. See (http://docs.python-guide.org/en/latest/dev/virtualenvs/ "virtualenvs") for how to do this.

For all steps from now on (setup and development), have venv activated so you work using the venv Python executable and installed libraries.

Install all required packages using `pip install -r requirements.txt`  This installs Django 1.8.3 and other libraries. If there is an issue installing or using psycopg2 and you are using Windows, you may need to install Microsoft Visual C++ Compiler for Python 2.7 and restart the command line. `pip uninstall psycopg2` then install [this version of psycopg](http://www.stickpeople.com/projects/python/win-psycopg/) using easy_install instead of pip.

The end product of this section is a project-specific Python executable with the site-packages/libraries needed to run server, which should run on your own computer only.

See also:
http://docs.python-guide.org/en/latest/dev/virtualenvs/
If you are using Windows PowerShell, see
http://stackoverflow.com/questions/1365081/virtualenv-in-powershell/10030999


## PostgreSQL Database

Similarly, it's not a good idea to move databases between computers, so here you can set up your own.


### New database

First [install PostgreSQL](http://www.postgresql.org/download/), including the pgAdmin III interface.  Open pgAdmin III. You will need to set up the postgres (root) password if this is your first time using it.

Create a new database on your Postgres server (default port 5432) by right-clicking 'Databases' in the menu hierarchy and selecting 'New database...' Call it 'ldt'.


### settings.py

Inside /server/ldt/ldt of this repo, create a new settings.py file.  Into settings.py, copy and paste all the text located in `settings_template.` in /server.

Where is says 'TODO', fill in your local database's password and your choice of secret key for the app, as indicated.


### Migrate database and Activate models

The first time you set up your database, you will need to call `python manage.py migrate` as per the [Django tutorial](https://docs.djangoproject.com/en/1.8/intro/tutorial01/). Then, call `python manage.py makemigrations ldtserver` and `python manage.py migrate` once more.

Calling `makemigrations` and `migrate` is needed whenever changes are made to the ldtserver's model classes. This updates the columns of the underlying database's tables to match the fields of the class instances.


### createsuperuser

Before you can access the Django admin panel, be sure to call `python manage.py createsuperuser`. This way you can log in to use Django's built-in admin GUI to create and manage class objects in the browser. This is only one way but an easy way to create new model instances; see [Django tutorial](https://docs.djangoproject.com/en/1.8/intro/tutorial01/) for more options.



# Using localhost server in development

Once set up, activate the venv and run the server on your local machine as follows:

1. Activate venv. [See also](http://docs.python-guide.org/en/latest/dev/virtualenvs/)
1. Make sure the database is online, e.g by using pgAdmin III if necessary
1. Run ldtserver by typing `python manage.py runserver` from within /server/ldt
1. server will be available at 127.0.0.1:8000 (localhost)
1. Create and manage class objects at 127.0.0.1:8000/admin/, using your superuser login.
1. Load the browser for all GET/POST/PUT/DELETE HTTP requests, provided by Django Rest Framework.
1. Use cURL or httpie for more direct, terminal/command line HTTP requests. This allows easier control of the headers sent with each request.



# Running Django unit tests

1. Activate venv [See also](http://docs.python-guide.org/en/latest/dev/virtualenvs/)
1. Run all unit tests by typing `python manage.py test` from /server/ldt
1. Running using `python manage.py test --with-coverage --cover-package=ldtserver` will print test coverage.



# Deploying to Droplet/Production Server

Follow this guide: https://www.digitalocean.com/community/tutorials/how-to-use-the-django-one-click-install-image. I was lazy and not smart, and used a shell client + SFTP to manage the server.

Notes:
* Main folder is 'django_project' instead of 'ldt' (which can be changed but I haven't taken the time yet)
* The `settings.py` in /django_project/django_project is quite different from the local `settings.py` in /ldt/ldt, so be careful when updating.
