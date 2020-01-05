from src.libraries import *

OWMAPIKey = 'a1cf0a5ff6cbdc4c19234bbd4c686299'

def threadedRequest(url,headers,obj,key):
    data = requests.get(url,headers=headers).json()
    obj[key] = data

def getWeatherByCoords(data):
    sParams = {
        'lat': data['latitude'],
        'lon': data['longitude'],
    }
    wData = {}

    NOAAThread = threading.Thread(
        target = callNOAA,
        args = (
            sParams,
            wData
        )
    )

    OWMThread = threading.Thread(
        target = callOpenWeatherMap,
        args = (
            sParams,
            wData
        )
    )

    NOAAThread.start()
    OWMThread.start()

    NOAAThread.join()
    OWMThread.join()

    return wData

def callNOAA(coords,wData):
    latitude  = round(float(coords['lat']),4)
    longitude = round(float(coords['lon']),4)

    data = {}
    baseURL = 'https://api.weather.gov/points/'+str(latitude)+','+str(longitude)
    headers  = {
        'Accept': 'application/vnd.noaa.dwml+xml;version=1'
    }
    data['base'] = requests.get(baseURL,headers=headers).json()

    dailyURL  = data['base']['properties']['forecast']
    hourlyURL = data['base']['properties']['forecastHourly']

    dailyThread = threading.Thread(
        target=threadedRequest,
        args=(
            dailyURL,
            headers,
            data,
            'daily'
        )
    )
    hourlyThread = threading.Thread(
        target=threadedRequest,
        args=(
            hourlyURL,
            headers,
            data,
            'hourly'
        )
    )

    dailyThread.start()
    hourlyThread.start()

    dailyThread.join()
    hourlyThread.join()

    wData['NOAA'] = data

def callOpenWeatherMap(customParams,wData):
    sParams = { 'appid': OWMAPIKey }

    for k,v in customParams.items():
        sParams[k] = v

    if not sParams.get('units',None):
        sParams['units'] = 'imperial'

    data = requests.get('https://api.openweathermap.org/data/2.5/weather',
        params=sParams,
    )

    data = data.json()

    wData['OWM'] = {
        'condition': getCondition(data['weather'][0]),
        'temp': int(data['main']['temp']),
        'city': data['name'],
        'wind': {
         'speed': round(data['wind']['speed']),
         'direction': degreesToBearing(data['wind'].get('deg',None)),
         'gust': data['wind'].get('gust',None)
        },
        'sunInfo':{
            'isDaytime': isDaytime(data['sys']['sunrise'],data['sys']['sunset']),
            'sunrise': data['sys']['sunrise'],
            'sunset': data['sys']['sunset']
        },
        'OWM': data
    }

def getCondition(data):
    if 'description' in data.keys():
        return data['description']
    elif 'main' in data.keys():
        return data['main']
    else:
        return'NO CONDITION FOUND'

def degreesToBearing(degrees):
    if degrees == None: #if not measured
        return degrees
    bearingOptions = {
        0: 'North',
        1: 'North-East',
        2: 'East',
        3: 'South-East',
        4: 'South',
        5: 'South-West',
        6: 'West',
        7: 'North-West',
        8: 'North'
    }
    bearing = round(degrees/45)
    return bearingOptions[bearing]

def isDaytime(sunrise,sunset):
    now = time.time()
    if now > sunrise:
        if now < sunset:
            return True
    return False
