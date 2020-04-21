from src.clientAssets import files,randomize
from src.blueprints import general
from src.libraries import (
####    Flask
    render_template,
    make_response,
    request,
    APIKeys
)


#####################################################
#       Load Base Document
#####################################################
@general.route('/')
def main():
    assets = files
    return render_template(
        'init/index.html',
        assets=assets,
        analyticsID=APIKeys.GAnalytics
    )

#####################################################
#       PWA Service Worker
#####################################################
@general.route('/worker.js')
def workerJS():
    r = make_response(
        render_template('worker.js',assets=files),
        200
    )
    r.headers['Content-Type'] = 'text/javascript'
    return r
