from src.blueprints import API
from src.libraries import (
####    Flask
    jsonify,
    request,
####    Internal
    weather,
    general
)

#####################################################
#       API Calls
#####################################################

@API.route('/weatherLookup')
def weatherInfo():
    coords = {
        'latitude': request.args.get('latitude'),
        'longitude': request.args.get('longitude'),
        'units': request.args.get('units')
    }
    data = weather.getWeatherByCoords(coords)
    data['call'] = coords
    return jsonify(data)



@API.route('/location2Coords')
def location2Coords():
    location = request.args.get('address')
    data = googleMapsGeocoding.lookup(location)
    return jsonify(data)

@API.route('/IP2Coords')
def IP2Coords():
    clientIP = request.remote_addr
    return jsonify(general.IP2Coords(clientIP))
