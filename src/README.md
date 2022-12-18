## ./libraries
A lot of the "business logic" is contained here- calls to external services, etc.

## ./static
contains all frontend js, css, and images

## ./templates
contains the core html files

## ./views
contains the forward facing blueprints or controllers (http endpoints)

## ./app.py 
responsible for:
- blueprint initialization
- static file mapping (url rules)
- error handling

## ./blueprints.py
Generates the blueprints that get initialized in app.py

## ./clientAssets.py
A running list of all assets referenced by the app, referenced in the worker.js template