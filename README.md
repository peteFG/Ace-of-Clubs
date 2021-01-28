# Ace-of-Clubs
## Ace-of-Clubs - IMA - Schweighofer/Tripolt/Druckenthaner/Feldgrill


Ace of Clubs is a web application for planning events for clubs of all sorts. It is used to organize events and meetings efficiently and effectively with your club members. This project was developed in the course of the study Information Management (IMA18) at the University of Applied Sciences FH JOANNEUM. The project was supervised by DI Stefan Krausler-Baumann and Mag. Karl Kreiner.


### Team Members:

* Martin Schweighofer
* Christoph Tripolt
* Sophia Druckenthaner
* Peter Feldgrill

### Workload distribution:

In general most tasks were split between the group members:
* Martin Schweighofer: general Frontend development, project-logic, debugging expert...
* Christoph Tripolt: Backend development, register, login, searching, filtering & sorting...
* Sophia Druckenthaner: Frontend development, visual representation, styling, ...
* Peter Feldgrill: Frontend development, vacation functionality, user-profile, fileupload

### Setup Guide

* Download the project from this repo.
* Open the project with IntelliJ Idea Ultimate.
* Make sure that Python Version 3.8 or higher is installed and configured correctly on your machine (developed with Python 3.8.5 and 3.8.6).
* Also make sure that Django and Angular CLI are installed and configured correctly.
* Install the required packages in backend/requirements.txt and frontend/package.json. If this does not work you might have to try it again after the next step.
* In IntelliJ, click on File -> Project Structure -> Modules, then click on the + symbol. After this click on Import Module and select the project's frontend folder. Leave all the default settings and click next until your frontend is imported. Then do the same thing for your backend folder, however you will be asked to configure your virtual environment correcty before being able to import it. After doing so make sure that your Django server is recognised by IntelliJ. If it is not go to Facets, click on the + and select Django. Afterwards you might have to restart IntelliJ before being able to proceed.
* You can import some default data by "executing manage.py loaddata Fixtures.json" when you are in the backend folder.
* The default login credentials for the Administrator user are username: admin; password: admin. Make sure to change them before you get your application up and running.
* Start your Django and Angular CLI server with IntelliJ and open localhost:4200 in your preferred webbrowser to access the frontend; open localhost:8000 to access the backend.

You have now configured your Ace-of-Clubs webapplication correctly and can start using it right away to organize your club-specific events and meetings!
