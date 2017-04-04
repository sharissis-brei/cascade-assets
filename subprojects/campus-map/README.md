# Campus Map

## Overview

This subproject contains the BarkleyREI project version for the Campus Map, including a grunt build system to produce web-ready files. We use an in-house open-source app generator, found here: https://github.com/BarkleyREI/generator-brei-app.

Note: The Campus Map uses an older, deprecated version of the BarkleyREI Yeoman generator: 1.2.4. Support and maintenance is no longer available.

The file structure includes two top level folders, `build` and `source`. The `source` folder contains all precompiled and uncompressed source files, and the `build` folder is where the web-ready files deploy to (see instructions in the Deployment section below).

Within the `source` folder, there is a folder called `static`. The `static` folder contains the original source code, including static HTML of the site that can be run locally.

## Installation

The Campus Map project is developed using a Node app generator. To install and setup the app generator on a Mac, download and install Node v5.11.1 and then run the following commands:

	https://nodejs.org/dist/v5.11.1/

    cd subprojects/campus-map/source/static/

    sudo gem install -n /usr/local/bin compass
    sudo gem install -n /usr/local/bin scss_lint
    
    npm install grunt-cli

    npm install -g bower
    npm install -g jshint

    npm install
    bower install

## Testing

To test your project, you will want to deploy the contents of the `build` directory to a server. This is the directory that contains the built, web-ready content.

## Deployment

The following commands can be used to run, build, and finally, deploy your project to the `build` directory.

- `grunt server` – Runs the project on a local server, shows any changes made using livereload
- `grunt` – Builds the project once all your changes have been made
- `grunt deploy` – Deploys the built version of the project from `source/static/dist` into the `build` directory, which is the web-ready version of the site

# Campus Map API

The Campus Map is made functional with the following scripts:

- js/map/virtualTour.js (Namespace, Custom location object - e.g. "updateFunction")
- js/map/missionControl.js (Toggle Mobile/Desktop display)
- js/map/mainNavigation.js (Toggle Category Menu/Search)
- js/map/map.js (Google Maps API instantiation)
- js/map/categoryMenu.js (Toggle categories; create and display Google Maps markers)
- js/map/managePanels.js (Toggle "Landmarks" and "Virtual Tour" panels; Show "Virtual Tour" detail)
- js/map/search.js (Custom search logic)
- js/map/mapBar.js (Google Maps Street View)
- js/map/tourPanel.js (JS Events)
- js/map/overlays.js (Maps JavaScript API - Polygons)
	- https://developers.google.com/maps/documentation/javascript/examples/polygon-simple
	- https://developers.google.com/maps/documentation/javascript/examples/polygon-arrays

Custom Google Maps Overlays (Lat, Lng Coordinates)

- js/map/mapOverlays.js


Sean Stacho
BarkleyREI
sstacho@barkleyrei.com
