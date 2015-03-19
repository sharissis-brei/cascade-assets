# Cascade Assets
Manage assets outside of cascade.

Update: We are working on integrating these styles into the 2 column and 3 column modular templates.  
[Use This Spreadsheet to Track Bugs](https://docs.google.com/spreadsheets/d/1PKrGIaNUXJA2B0_kvjVW8TWT7djb8DXJpwrZ48lSjFc/edit#gid=0)


## Setup
```
git clone git@github.com:chapmanu/cascade-assets.git
cd cascade-assets
bundle install
rake serve
```
Send your browser to [http://localhost:5000](http://localhost:5000)  
Turn on your livereload extention (optional)

## Editing assets
All assets are located in the `src/` folder.  Change stylesheets there and test them out on the sample pages located in the `docs/` folder.

## Deploying to Cascade

### Step 1: Build

In your terminal, run one of these rake build commands.

```bash
# For the cascade production server
rake build:production

# For the cascade dev server
rake build:staging
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

Edit that block to match `block.xml` located in the `/dist` folder you just build.  Copy and paste please.



### Step 5: Have a Drink

> (coffee if AM, beer if PM) 

The styles are ready to go.  

Every page that is published from now on will use the new assets.



