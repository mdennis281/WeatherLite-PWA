from src.libraries import *

app = Flask(__name__)

# config
app.config.update(
    DEBUG=True,
    SECRET_key='54685'
)


#####################################################
#       HTML Web Parts
#####################################################

@app.route('/')
def main():
    return render_template('init.html')

@app.route('/parts/<part>')
def getPart(part):
    try:
        return render_template('/parts/'+part+'.html')
    except:
        return flask.redirect('/404')


#####################################################
#       API Calls
#####################################################

@app.route('/API/weatherLookup')
def weatherInfo():
    coords = {
        'latitude': request.args.get('latitude'),
        'longitude': request.args.get('longitude'),
        'units': request.args.get('units')
    }
    data = weather.getWeatherByCoords(coords)
    data['call'] = coords
    return jsonify(data)



@app.route('/API/location2Coords')
def location2Coords():
    location = request.args.get('address')
    data = googleMapsGeocoding.lookup(location)
    return jsonify(data)

@app.route('/API/IP2Coords')
def IP2Coords():
    clientIP = request.remote_addr
    return jsonify(general.IP2Coords(clientIP))


#####################################################
#       Image Resizing/Path Redirection
#####################################################

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

@app.route('/apple-touch-icon.png')
def getATI():
    return customImage('appIcon.png',180)


#####################################################
#       PWA Files
#####################################################

@app.route('/manifest.json')
def getManifest():
    return send_from_directory('./static', 'manifest.json')


@app.route('/worker.js')
def getSW():
    return send_from_directory('./static/js', 'worker.js')


#####################################################
#       Error Handling
#####################################################

@app.errorhandler(404)
def page_not_found(e):
    return "Page Not Found", 404

#####################################################
#       Error Logging
#####################################################

@app.route('/errorLogger',methods=['POST'])
def errorLogger():
    x=request.json

    print(x)
    return 'yee'
