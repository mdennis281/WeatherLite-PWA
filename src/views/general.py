from src.clientAssets import files,randomize
from src.blueprints import general
from src.libraries import (
####    Flask
    render_template,
    make_response,
    request
)


#####################################################
#       Load Base Document
#####################################################
@general.route('/')
def main():
    assets = files
    if request.cookies.get('devMode'):
        assets = randomize(assets)
    return render_template('init/index.html',assets=assets)


@general.route('/worker.js')
def workerJS():
    r = make_response(
        render_template('worker.js',assets=files),
        200
    )
    r.headers['Content-Type'] = 'text/javascript'
    return r
