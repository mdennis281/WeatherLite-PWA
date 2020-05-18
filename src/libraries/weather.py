from src.libraries import (
    threading,
    requests,
    APIKeys
)

# used to make multiple requests
# and append the response to an object
# used in callNOAA()
def threadedRequest(url,headers,obj,key):
    r = requests.get(url,headers=headers)
    if r.status_code == 200:
        obj[key] = r.json()
    else:
        obj['success'] = False
        obj['error'] = 'NOAA API failed on call: '+key +' (HTTP '+str(r.status_code)+')'



# Gets weather info from OWM and NOAA APIs
# returns an object with all weather info
# in the formatting expected by clientside
def getWeatherByCoords(data):
    sParams = {
        'lat': data['latitude'],
        'lon': data['longitude'],
    }
    wData = {'success':True}

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

    if not 'NOAA' in wData.keys():
        wData['success'] = False
        wData['error'] = 'NOAA API failed'
    elif not 'OWM' in wData:
        if not wData['NOAA']:
            wData['success'] = False
            wData['error'] = 'OWM API failed'

    return wData

def callNOAA(coords,wData):
    latitude  = round(float(coords['lat']),4)
    longitude = round(float(coords['lon']),4)

    data = {}
    baseURL = 'https://api.weather.gov/points/'+str(latitude)+','+str(longitude)
    headers  = {
        'Accept': 'application/vnd.noaa.dwml+xml;version=1'
    }
    r = requests.get(baseURL,headers=headers)
    if r.status_code == 200:
        data['base'] = r.json()
    else:
        wData['success'] = False
        wData['error'] = 'NOAA API failed on call: base (HTTP '+str(r.status_code)+')'
        return


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
    if data.get('success') == False:
        wData['success'] = False
        wData['error']   = data['error']
    wData['NOAA'] = data

def callOpenWeatherMap(customParams,wData):
    sParams = { 'appid': APIKeys.OWM }

    for k,v in customParams.items():
        sParams[k] = v

    if not sParams.get('units',None):
        sParams['units'] = 'imperial'

    r = requests.get('https://api.openweathermap.org/data/2.5/weather',
        params=sParams,
    )

    if r.status_code == 200:
        data = r.json()
        wData['OWM'] = data
    else:
        wData['success'] = False
        wData['error'] = 'OWM API failed. (HTTP '+str(r.status_code)+')'
