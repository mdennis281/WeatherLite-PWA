from src.blueprints import blueprint_list as blueprints
from src.libraries.general import appleTouchIcon

from flask import (
    Flask,
    send_file
)

app = Flask(__name__)


#####################################################
#       Static File Mapping
#####################################################


@app.route('/manifest.json')
def manifest():
    return app.send_static_file('manifest.json')

@app.route('/apple-touch-icon.png')
def apple_touch_icon():
    return send_file(
        appleTouchIcon(),
        mimetype='image/png',
        as_attachment=False
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
    app.register_blueprint(blueprint)


