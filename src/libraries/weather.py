from src.libraries import *

OWMAPIKey = 'a1cf0a5ff6cbdc4c19234bbd4c686299'

def getWeatherByCoords(data):
    sParams = {
        'lat': data['latitude'],
        'lon': data['longitude'],
    }
    callOpenWeatherMap(sParams)


def callOpenWeatherMap(customParams):
    sParams = { 'appid': OWMAPIKey }

    for k,v in customParams.items():
        sParams[k] = v

    if sParams.get('units',None):
        sParams['units'] = 'imperial'
    
    data = requests.get('https://api.openweathermap.org/data/2.5/weather',
        params=sParams,
    )

    data = data.json()

    return {
        'condition': data['weather'][0]['main'],
        'temp': data['main']['temp'],
        'city': data['name'],
        'wind': data['wind']['speed'],
        'windDirection': degreesToBearing(data['wind'].get('deg',None)),
        'windGust': data['wind'].get('gust',0)
    }

def degreesToBearing(degrees):
    if degrees == None: #if not measured
        return degrees
    bearingOptions = {
        0:'N',
        1: 'NE',
        2: 'E',
        3: 'SE',
        4: 'S',
        5: 'SW',
        6: 'W',
        7: 'NW',
        8: 'N'
    }
    bearing = round(degrees/45)
    return bearingOptions[bearing]
