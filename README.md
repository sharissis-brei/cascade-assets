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
# For the cascade dev server
rake build RAILS_ENV=staging

# For the cascade production server
rake build RAILS_ENV=production
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

### CSS Conventions

#### Widget Names and Classes
HTML for widgets should all have a class on the outer most element composed of its name followed by the `-widget` suffix.  For example:

```html
<div class="messaging-widget"> ... </div>
<div class="chapman-social-feed-widget"> ... </div>
<div class="cta-3-column-widget"> ... </div>
<div class="cta-block-widget"> ... </div>
```

#### Widget Variations

When it is necessary to have variations of the same widget, add more classes to the root element of the widget.  The classes should consist of the full widget class name noted above, followed by two underscores and the name of the variation.

```html
<div class="messaging-widget messaging-widget__2-column"> ... </div>
<div class="messaging-widget messaging-widget__1-column"> ... </div>
<div class="messaging-widget
            messaging-widget__1-column
            messaging-widget__text-light"> ... </div>
```

Following these conventions helps us keep our css in check.

## Data Definition XML Conventions

### Links
Follow these conventions to keep our xml consistent across link types in our data definitions within Cascade.

#### Media/Image Link

```xml
<group identifier="media" label="Media">
  <text type="radiobutton" identifier="linkType" label="Link Type" default="External Link" help-text="Your Photo Dimensions Here">
    <radio-item value="External Link" show-fields="path/to/my/widget/media/externalLink"/>
    <radio-item value="File Link" show-fields="path/to/my/widget/media/fileLink"/>
  </text>
  <text identifier="externalLink" label="External Link" help-text="full url (including http) to page outside of Cascade"/>
  <asset type="file" identifier="fileLink" label="File Link"/>
  <text identifier="alternateText" label="Alternate Text"/> <!-- Do NOT include alt text if image is a background image -->
</group>
``` 

#### Page Link

```xml
<group identifier="link" label="Link">
  <text type="radiobutton" identifier="linkType" label="Link Type" default="Internal Link">
    <radio-item value="Internal Link" show-fields="path/to/my/widget/link/internalLink"/>
    <radio-item value="External Link" show-fields="path/to/my/widget/link/externalLink"/>
    <radio-item value="File Link" show-fields="path/to/my/widget/link/fileLink"/>
  </text>
  <text identifier="externalLink" label="External Link" help-text="full url (including http) to page outside of Cascade"/>
  <asset type="page" identifier="internalLink" label="Internal Link"/>
  <asset type="file" identifier="fileLink" label="File Link"/>
  <text identifier="label" label="Label"/>
</group>
```

## Velocity Templating Language Cheat Sheet

#### Setting Variables
```html
 #set ($name = "James")
```

#### If Else
```
#if ($name == 'James')
 <h1>Hello James</h1>
#else
 <h1>Hello Other Person</h1>
#end
```

#### Loops
```html
 #set ($items = $_XPathTool.selectNodes($xml_object, '//path/to/items'))
 
 #foreach($item in $items)
   ...
   <h1>$item.getChild('title').value</h1>
   ...
 #end
```

#### String Interpolation
Wrap a variable with ${ ... } to interpolate it into a string. For example:
```
#set ($name = "James")
#set ($greeting = "Hello ${name}, Nice to meet you.")
```
You can also do ifs and elses right in a string.  For example:
```
#set($classStr = "messaging-widget__#if($textAlign == 'Left')text-left#{else}text-right#end")
```


#### Navigating XML Data
```html
## Selecting multiple xml nodes.
#set ($items = $_XPathTool.selectNodes($object, '//x_path/to/item'))

## Selecting a single node in xml
$_XPathTool.selectSingleNode($cardElement, 'backStat/title')

## Which is also the same as...
$cardElement.getChild('backStat').getChild('title')
```

#### Outputting values into HTML
```html
## You must always escape the value of an xml node before displaying it.
<p>$_EscapeTool.xml($cardElement.getChild('title').value)</p>
```

#### Macros
```html
#macro(outputCalloutText $param)
 <p>$_EscapeTool.xml($param.getChild('text').value)</p>
#end

## Call it with this...
#outputCalloutText($callout)
```

#### System Assets
If you are linking to interal files, you must wrap the url in [system-asset] tags.  This is so that the images will appear in the cascade preview window as well as the published page.  For example:
```html
 #set ($linkUrl = "[system-asset]${content.getChild('fileLink').getChild('path').value}[/system-asset]")
```