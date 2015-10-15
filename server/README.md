# About server

This the Let's Do This backend server.  It is a Django application that can be run on your machine's localhost. It is also online on our droplet.

devserver manages the 'Let's Do This' database of Users and Events (*in progress*). Accessing database entities requires sending http requests (GET/POST/PUT/DELETE) to the devserver's API (*in progress*). Later this will require a key, SSL, and/or certificate for security (probably after deployment).


# Why Django?

This seems to me to be the fastest option for deployment. We are allowed to use any language & framework for backend server. Django is a popular Python web application framework and, as such, DigitalOcean offers a 'one-click' install of Django on one of their droplet servers and $5/month hosting.  The DigitalOcean Community also contains several tutorials on how to work with their Ubuntu, Nginx, PostgreSQL, Gunicorn, Python, and Django web stack. Django's behaviour also abstracts away the web stack.

Django is quite bulky in terms of all its features + additional frameworks and seems like overkill for a database + API. But they install relatively quickly and are useful, such as the REST framework.


# Requirements

* Python 2.7 (https://www.python.org/downloads/release/python-2710/)
* pip (https://pip.pypa.io/en/stable/installing/#install-pip)
* virtualenv (https://virtualenv.pypa.io/en/latest/installation.html)
* PostgreSQL (http://www.postgresql.org/download/)
* httpie (https://github.com/jkbrzt/httpie)


# Setup

## Python 'Virtual' Environment

It's not a good idea to move a Python virtual environment between computers, so I ask that you first set up your own in order to run devserver on your machine, after you've cloned/pulled from Github.

Using Terminal/Command Line, navigate to this devserver folder.  Create a Python virtual environment using  `virtualenv venv`  I'm on Windows and have found that I usually need to drag virtualenv.exe from C:\Python27\Scripts into the Command Line, followed by typing `venv`, then Enter.

Test that new Python venv works by activating then deactivating it. See (http://docs.python-guide.org/en/latest/dev/virtualenvs/ "virtualenvs") for how to do this.

For all steps from now on (setup and development), have venv activated so you work using the venv Python executable and installed libraries.

Install all required packages using `pip install -r requirements.txt`  If there is an issue installing or using psycopg2 and you are using Windows, you may need to install Microsoft Visual C++ Compiler for Python 2.7 and restart the command line. `pip uninstall psycopg2` then install (http://www.stickpeople.com/projects/python/win-psycopg/ "this version of psycopg") using easy_install instead of pip.

The end product of this section is a project-specific Python executable with the site-packages/libraries needed to run devserver, which should run on your own computer only.

See also:
http://docs.python-guide.org/en/latest/dev/virtualenvs/
If you are using Windows PowerShell, see
http://stackoverflow.com/questions/1365081/virtualenv-in-powershell/10030999


## PostgreSQL Database

Similarly, it's not a good idea to move databases between computers, so here you can set up your own.


### New database

First (http://www.postgresql.org/download/ "install PostgreSQL"), including the pgAdmin III interface.  Open pgAdmin III. You will need to set up the postgres (root) password if this is your first time using it.

Create a new database on your Postgres server (5432) by right-clicking 'Databases' in the menu hierarchy and selecting 'New database...' Call it 'lgt'.


### settings.py

Inside devserver/ldt/ldt, create a new settings.py file.  Into settings.py, copy and paste all the text located in settings_template.txt in devserver.

Where is says 'TODO', fill in the database password and a secret key of you choice for the app, as indicated.


### Migrate database and Activate models

The first time you set up your database, you will need to call `python manage.py migrate` as per the (https://docs.djangoproject.com/en/1.8/intro/tutorial01/ "Django tutorial"). Then, call `python manage.py makemigrations lgtserver` and `python manage.py migrate` once more.

This will not be needed again unless changes have been made to the app server.


# Using devserver

Once set up, activate the venv and run the server on your local machine as follows:

1. Activate venv (http://docs.python-guide.org/en/latest/dev/virtualenvs/ "see also")
1. Make sure the database is online, e.g by using pgAdmin III
1. Run by lgt server typing `python manage.py runserver` from devserver/ldt
1. devserver will be available at 127.0.0.1:8000 (localhost)
1. Load the browser for all GET/POST/PUT/DELETE requests, provided by Django Rest Framework.
1. Use httpie for terminal/command line requests.
