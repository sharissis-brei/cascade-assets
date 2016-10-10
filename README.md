# Cascade Assets

This repository consists of sample HTML that Cascade Server generates for www.chapman.edu.  It contains the build system for stylesheets, javascripts, and images that we use on www.chapman.edu.  Use this repository to develop for www.chapman.edu locally, then deploy your HTML changes and asset files to the Cascade Server when they are ready.


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

- **HTML:** Sample HTML for the website lives in `app/views`
- **CSS:** Edit the stylesheets in `app/assets/stylesheets/`
- **JS:** Edit the javascripts in `app/assets/javascripts/`
- **IMAGES:** Add/remove images in `app/assets/images/`


## Tests

The testing suite includes feature tests exercising javascript functionality. These tests require the phantomjs driver. The easiest way to install this is with homebrew:

    brew install phantomjs

To run all tests:

    bundle exec rake test

To run a single test:

    bundle exec rake test/features/dashboard_test.rb


## Deploying to Cascade

To deploy changes in this repository to Cascade, please see the [Cascade Accept Testing page](https://kb-smc.chapman.edu/?p=1860) in the Knowledge Base, which includes links to the pages on [Deploying Assets](https://kb-smc.chapman.edu/?p=1894) and [Deploying HTML](https://kb-smc.chapman.edu/?p=1887).


## CSS Conventions

### Widget Names and Classes
HTML for widgets should all have a class on the outer most element composed of its name followed by the `-widget` suffix.  For example:

```html
<div class="messaging-widget"> ... </div>
<div class="chapman-social-feed-widget"> ... </div>
<div class="call-to-action-3-up-widget"> ... </div>
<div class="call-to-action-block-widget"> ... </div>
```

### Widget Variations

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


## Velocity Templating Language (VTL) Cheat Sheet

For full reference, see [the Apache Velocity Project site](http://velocity.apache.org/engine/1.7/vtl-reference.html).

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
