# Image processing Data Handler for CS-C3140
The data handler receives metadata about parking lot/car images from image processing network,
saves the data to the MongoDB database and updates any connected clients with the new data.
Application is made using Nodejs, where express library was used to establish REST api and
socket.io to establish web socket updates for the clients. Frontend is done using React libraries.
For the database we used non-relational MongoDB, which runs on mLab platform.
## Installation
**Pre-requisites:** npm 5.5.1+ node 6.11.4+

**Execute in the project directory:**

`npm install`

## BasicContent structure
 - You can find REST api in `routes/index.js`. `bin/www` contains server configuration along with socket.io configuration.
 - React code is written in `reactApp/main.jsx` file and "compiled" or "packed" into simple .js file using
gulp command from the command line in the project directory.
 - Gulp uses browserify, with the babelify to pack the code into single .js file.
For the application there is only one .jsx react file, since the code is pretty simple. Otherwise the application
code can be separated into multiple files.
## MongoDB & mLab
Connection is established in the `app.js` file, where all the application configuration is taking place (apart from sockets,
because they need to be configured along with the server). `sensitiveExample.json` contains example of what `sensitive.json` file should contain.
The username and password should be according to the mLab database configuration.

## References
 - Application is running on Heroku platform: https://g6-os.herokuapp.com
 - Link for mLab (Free for sub 500 MB Databases): https://mlab.com/
 - TensorFlow image processing: https://github.com/Oleffa/Aalto-OperatingSystems-Challenge
