from src.libraries import *

app = Flask(__name__)

# config
app.config.update(
    DEBUG=True,
    SECRET_key='54685'
)

@app.route('/')
def main():
    return render_template('init.html')


@app.route('/API/weather/<lookupType>')
def weatherInfo(lookupType):
    if lookupType == 'byCoordinates':
        coords = {
            'latitude': request.args.get('latitude'),
            'longitude': request.args.get('longitude')
        }
        return jsonify(weather.getWeatherByCoords(coords))
    if lookupType == 'byName':
        cityName = request.args.get('city')
        try:
            return jsonify(weather.getWeatherByName(city))
        except:
            abort(400, 'City Not Found')


    return flask.redirect('/404')

@app.route('/appIcon.png')
def appIcon():
    size = int(request.args.get('size'))
    return customImage('appIcon.png',size)

@app.route('/app/images/<path:imagePath>')
def customImage(imagePath,imageWidth=None, imageHeight=None):
    if not imageWidth:
        imageWidth = request.args.get('width')
        if imageWidth:
            imageWidth = int(imageWidth)
    if not imageHeight:
        imageHeight = request.args.get('height')
        if imageHeight:
            imageHeight = int(imageHeight)


    image = general.imageResizer(imagePath,imageWidth,imageHeight)
    return send_file(image,mimetype='image/png',as_attachment=False)

@app.route('/manifest.json')
def getManifest():
    return send_from_directory('./static', 'manifest.json')


@app.route('/worker.js')
def getSW():
    return send_from_directory('./static/js', 'worker.js')

@app.route('/apple-touch-icon.png')
def getATI():
    return customImage('appIcon.png',180)

@app.errorhandler(404)
def page_not_found(e):
    return "Page Not Found"
