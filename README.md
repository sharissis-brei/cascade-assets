# Cascade Assets

This repository consists of sample HTML that Cascade Server generates for www.chapman.edu.  It contains the build system for stylesheets, javascripts, and images that we use on www.chapman.edu.  Use this repository to develop for www.chapman.edu locally, then copy your HTML changes and asset files into Cascade Server when they are ready.

## Setup
```
git clone git@github.com:chapmanu/cascade-assets.git
cd cascade-assets
bundle install
rake serve
```
Send your browser to [http://localhost:5000](http://localhost:5000)
Turn on your livereload extention (optional)

## Making Changes

**HTML:** Sample HTML for the website lives in `app/views`
**CSS:** Edit the stylesheets in `app/assets/stylesheets/`
**JS:** Edit the javascripts in `app/assets/javascripts/`
**IMAGES:** Add/remove images in `app/assets/images/`

## Deploying Assets to Cascade

### Step 1: Build

In your terminal, run one of these rake build commands.

```bash
# For the cascade production server
rake build RAILS_ENV=production

# For the cascade dev server
rake build RAILS_ENV=staging
```

### Step 2: Upload

In cascade, click the `[Tools -> Zip Archive]` menu item.

Change the placement folder to `/_assets`.

Upload the `_assets.zip` file located in the folder you just built.

Click submit.

### Step 3: Publish

> Very Important Step!

Publish the `_assets` folder on cascade so that the new assets will be available.




### Step 4: Link Templates to New Assets

Find the block located at `_cascade/blocks/html/cascade-assets`

Edit that block to match `cascade-assets.xml` located in the `/dist` folder you just build.  Copy and paste please.



### Step 5: Have a Drink

> (coffee if AM, beer if PM)

The styles are ready to go.

Every page that is published from now on will use the new assets.

## Deploy HTML to Cascade

All HTML must be manually copied and converted into Cascade.

### Templates

Chapman.edu has 3 different templates for content:

  * 3 Column Template
  * 2 Column Template
  * 1 Column Template

Each template is composed of modular widgets in each column.  Website editors can add as many widgets as they want to a column, and reorder them as they desire.

In this Jekyll repository, the templates live in the `app/views/layouts/` folder.
In Cascade, the templates live in `_cascade/templates/modular/`

### Widgets

There are two types of widgets:

  * Primary Column Widgets (designed to fit into the primary column of the template)
  * Side Column Widgets (designed to fit into the left and/or right columns of the template)

In this repository, the code for widgets lives in the following folders:
  * The HTML for sample versions of the widgets lives in `app/views/widgets/`
  * The CSS for the widgets lives in `app/assets/stylesheets/widgets/`
  * The JS for the widgets lives in `app/assets/javascripts/widgets/` (at the moment it doesn't but it will soon)

In Cascade, the code that outputs the widget HTML is located in `_cascade/formats/modular/widgets`
