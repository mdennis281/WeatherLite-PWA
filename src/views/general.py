from src.clientAssets import files
from src.libraries.config import APIKeys
from src.libraries.general import getAppVersion
from src.blueprints import general
from flask import (
####    Flask
    render_template,
    make_response
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
        analyticsID=APIKeys['GAnalytics']
    )

#####################################################
#       PWA Service Worker
#####################################################
@general.route('/worker.js')
def workerJS():
    r = make_response(
        render_template(
            'worker.js',
            assets=files,
            appVersion = getAppVersion()
        ),
        200
    )
    r.headers['Content-Type'] = 'text/javascript'
    return r
