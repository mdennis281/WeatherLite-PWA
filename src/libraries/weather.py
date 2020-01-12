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

    wData['OWM'] = data
