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
## Using Metadata for Parking Lot
The data that arrives from image processing network contains on how many cars were detected,
their relative position in the image: xmin, ymin, xmax, ymax coordinates of a rectangle. The coordinates are withing
[0;1] range.

When creating a template, data handler application uses xmin and ymin to define a parking spot.
Whenever a data update is received by data handler the xmin and ymin of "new" cars are compared to xmin and ymin stored in DB.
If the new coordinates are withing the range of any of the templates, then it is assumed that car has parked at that spot.

Apart from rectangle coordinates, the metadata also contains amount of detected objects, and probabilities for each rectangle.
On the frontend application we visualize this data in the form of colored table cells. If the metadata counts
less than maximum possible parking space, then remaining space is assumed to be 100% free and explicitly shown as
`Guaranteed parking spots x/max`.

**For the probabilities:**
 - If less than 0.33, then table cell is green and parking spot
is considered to be free.
 - If more than 0.33, but less than 0.6 (indicated by yellow color) then it is probably reserved, but the customer could check if it is free.
 - If more than 0.6 the table cell is coloured

## References
 - Application is running on Heroku platform: https://g6-os.herokuapp.com
 - Link for mLab (Free for sub 500 MB Databases): https://mlab.com/
 - TensorFlow image processing: https://github.com/Oleffa/Aalto-OperatingSystems-Challenge
