from src.blueprints import all as blueprints
from src.libraries.general import appleTouchIcon

from flask import (
    Flask,
    send_file
)
from importlib import import_module

app = Flask(__name__)


#####################################################
#       Static File Mapping
#####################################################

app.add_url_rule(
    '/manifest.json',
    'manifest',
    lambda: app.send_static_file('manifest.json')
)


app.add_url_rule(
    '/apple-touch-icon.png',
    'apple-touch-icon',
    lambda: send_file(
        appleTouchIcon(),
        mimetype='image/png',
        as_attachment=False
    )
)


#####################################################
#       Server Error Handling
#####################################################

@app.errorhandler(404)
def page_not_found(e):
    return "Page Not Found", 404

@app.errorhandler(400)
def malformed_request(e):
    return "Malformed Request", 400


#####################################################
#       Import Blueprints
#####################################################

for blueprint in blueprints:
    import_module(blueprint.import_name)
    app.register_blueprint(blueprint)
