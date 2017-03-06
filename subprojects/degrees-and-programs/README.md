# Degrees and Programs

## Overview

This subproject contains the BarkleyREI project version of Degrees and Programs, including a grunt build system to produce web-ready files. We use an in-house open-source app generator, found here: https://github.com/BarkleyREI/generator-brei-app.

The file structure includes two top level folders, `build` and `source`. The `source` folder contains all precompiled and uncompressed source files, and the `build` folder is where the web-ready files deploy to (see instructions in the Deployment section below).

Within the `source` folder, there are two subdirectories, `cascade` and `static`. The `cascade` folder contains copies of the most recent Chapman Cascade Server assets, such as templates and formats. The `static` folder contains the original source code, including static HTML of the site that can be run locally.

## Dependancies

A few dependancies are required to run the app generator, including:

- Yeoman
- Ruby
- Compass
- Sass
- SCSS_Lint
- Node

These dependancies can all be found in the README of the app generator. Once you've installed the dependancies on your machine, you'll want to cd into `source/static`. To add the previously installed dependancies into the project itself, run the following commands:

- npm install
- bower install

You may need to run this in administrator mode (or sudo if you're on a Mac) to get these to work.

## Testing

To test your project, you will want to deploy the contents of the `build` directory to a server. This is the directory that contains the built, web-ready content.

## Deployment

The following commands can be used to run, build, and finally, deploy your project to the `build` directory. 

- `grunt server` – Runs the project on a local server, shows any changes made using livereload
- `grunt` – Builds the project once all your changes have been made
- `grunt deploy` – Deploys the built version of the project from `source/static/dist` into the `build` directory, which is the web-ready version of the site


Sarah Harissis
BarkleyREI
sharissis@barkleyrei.com
