from src.blueprints import API
from src.libraries.climacell import WeatherData
from src.libraries import (
    weather,
    general,
    googleMaps
)
from flask import (
    jsonify,
    request,
    abort
)
#####################################################
#       API Calls
#####################################################
"""
@API.route('/weatherLookup')
def weatherInfo():
    coords = {
        'latitude': request.args.get('latitude'),
        'longitude': request.args.get('longitude'),
        'units': request.args.get('units')
    }
    if coords['latitude'] and coords['longitude']:
        data = weather.getWeatherByCoords(coords)
        data['call'] = coords
        return jsonify(data)
    return abort(400)
"""
@API.route('/weatherLookup')
def weatherInfoTest():
    args = {}
    for k,v in request.args.items(): args[k] = v

    try:
        coords = (
            args.pop('latitude'),
            args.pop('longitude')
        )

        ans = WeatherData.getWeather(coords,**args)
        ans['call'] = request.args
        return jsonify(ans)
    except KeyError:
        return abort(400)





@API.route('/address2Coords')
def address2Coords():
    location = request.args.get('address')
    if location:
        return jsonify(googleMaps.geocoding(location))
    return abort(400)

@API.route('/IP2Coords')
def IP2Coords():
    clientIP = request.remote_addr
    if clientIP:
        return jsonify(general.IP2Coords(clientIP))
    return abort(400)

@API.route('/placesLookup')
def placesLookup():
    query = request.args.get('query')
    debug = request.args.get('debug')
    if query:
        return jsonify(googleMaps.places(query,debug))
    return abort(400)

@API.route('/app/version')
def getVersion():
    return jsonify({
        'version': general.getAppVersion()
    })
