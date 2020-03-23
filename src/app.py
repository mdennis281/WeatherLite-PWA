from src.blueprints import all as blueprints
from src.views.appImages import customImage
from src.libraries import *


"""
from src.libraries import (
####    Flask
    render_template,
    send_file,
    redirect,
    jsonify,
    request,
    Flask,
####    External

####    Internal

)
"""
app = Flask(__name__)

app.config.update(
    DEBUG = True,
    SECRET_KEY = '12345'
)

#####################################################
#       Static File Mapping
#####################################################

app.add_url_rule(
    '/manifest.json',
    'manifest',
    lambda: app.send_static_file('manifest.json')
)

app.add_url_rule(
    '/worker.js',
    'worker',
    lambda: app.send_static_file('js/worker.js')
)

app.add_url_rule(
    '/apple-touch-icon.png',
    'apple-touch-icon',
    lambda: customImage('appIcon.png',180)
)


#####################################################
#       Server Error Handling
#####################################################

@app.errorhandler(404)
def page_not_found(e):
    return "Page Not Found", 404


#####################################################
#       Import Blueprints
#####################################################

for blueprint in blueprints:
    import_module(blueprint.import_name)
    app.register_blueprint(blueprint)
