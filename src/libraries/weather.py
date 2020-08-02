from src.libraries.timer import Timer
from src.libraries import APIKeys
import threading
import requests
import time


class WeatherInfo:
    def __init__(self,lat,lng):
        self.coords = {
            'lng': float(lng),
            'lat': float(lat)
        }
        self.data = {}
        self.timing = {}
        self.threads = []
        self.fail = []
    def _getJson(self,url,key,**kwargs):
        if kwargs.get('threaded'):
            kwargs.pop('threaded')
            T = threading.Thread(
                target = self._getJson,
                args = (url,key),
                kwargs = kwargs
            )
            self.threads.append(T)
            self.threads[-1].start()
        else:
            r,time = self._get(
                url,
                kwargs.get('headers'),
                kwargs.get('params')
            )
            self.timing[key] = time

            if r['success']:
                self.data[key] = r['request'].json()

            else:
                self.fail.append(key)
                try:
                    req = r['request'].json()
                    self.data[key] = req.get(
                        'detail',
                        req.get(
                            'title',
                            'Uncaught API Error'
                        )
                    )
                except TypeError:
                    self.data[key] = r['request'].text

    @Timer
    def _get(self,url,headers=None,params=None):
        r = requests.get(
            url,
            headers=headers,
            params=params
        )

        success = True if r.status_code == 200 else False

        return {
            'request': r,
            'success': success
        }

    def waitUntilComplete(self):
        for thread in self.threads:
            thread.join()

    def genErrMsg(self):
        if self.fail:

            error = 'External API failure: '
            svc = [self.fail.pop()]
            error += svc[-1]
            while self.fail:
                svc.append(self.fail.pop())
                error += ', ' + svc[-1]
            error += '<br/><p><b>Details:</b></p>'
            while svc:
                error += '<p>'+self.data[svc.pop()]+'</p>'
            return error
        else:
            return None




        'External API Failure: ' + str(weather.fail) if weather.fail else None


    def getOWM(self):
        url = 'https://api.openweathermap.org/data/2.5/weather'

        strParams = {
            'lat': self.coords['lat'],
            'lon': self.coords['lng'],
            'appid': APIKeys.OWM,
            'units': 'imperial'
        }

        self._getJson(
            url,
            'OWM',
            params   = strParams,
            threaded = True
        )

    def getNOAA(self):
        urlBase = ('https://api.weather.gov/points/'+
                str(self.coords['lat'])+','+str(self.coords['lng'])
        )
        headers = {
            'Accept': 'application/vnd.noaa.dwml+xml;version=1',
            'User-Agent': '(weatherlite.app, michael@dipduo.com)'
        }

        #make request to get the closest station to the aforementioned coords
        self._getJson(urlBase,'NOAA',headers=headers)

        if 'NOAA' not in self.fail:
            urlDaily  = self.data['NOAA']['properties']['forecast']
            urlHourly = self.data['NOAA']['properties']['forecastHourly']
        else:
            urlDaily,urlHourly = None,None

        self._getJson(
            urlDaily,
            'NOAA-daily',
            headers=headers,
            threaded=True
        )
        self._getJson(
            urlHourly,
            'NOAA-hourly',
            headers=headers,
            threaded=True
        )



def getWeatherByCoords(coords):

    @Timer
    def getWeatherData():
        weather = WeatherInfo(coords['latitude'],coords['longitude'])
        weather.getOWM()
        weather.getNOAA()
        weather.waitUntilComplete()
        return weather

    weather, gTime = getWeatherData()
    weather.timing['total'] = gTime



    return {
        'success': False if weather.fail else True,
        'error': weather.genErrMsg(),
        'timing': weather.timing,

        'OWM': weather.data.get('OWM'),
        'NOAA': {
            'base': weather.data.get('NOAA'),
            'hourly': weather.data.get('NOAA-hourly'),
            'daily': weather.data.get('NOAA-daily')
        }
    }
















# used to make multiple requests
# and append the response to an object
# used in callNOAA()
def threadedRequest(url,headers,obj,key):
    global TIMING
    start = time.time()
    r = requests.get(url,headers=headers)
    if r.status_code == 200:
        obj[key] = r.json()
    else:
        obj['success'] = False
        obj['error'] = 'NOAA API failed on call: '+key +' (HTTP '+str(r.status_code)+')'
    end = time.time()
    TIMING['NOAA-'+key] = round(end-start,2)



# Gets weather info from OWM and NOAA APIs
# returns an object with all weather info
# in the formatting expected by clientside
def _getWeatherByCoords(data):
    gStart = time.time()
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

    gEnd = time.time()
    TIMING['global'] = round(gEnd-gStart,2)
    wData['timing'] = TIMING

    return wData

def callNOAA(coords,wData):
    global TIMING
    start = time.time()
    latitude  = round(float(coords['lat']),4)
    longitude = round(float(coords['lon']),4)

    data = {}
    baseURL = 'https://api.weather.gov/points/'+str(latitude)+','+str(longitude)
    headers  = {
        'Accept': 'application/vnd.noaa.dwml+xml;version=1'
    }
    r = requests.get(baseURL,headers=headers)
    end = time.time()
    TIMING['NOAA'] = round(end-start,2)
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
    global TIMING
    start = time.time()
    sParams = { 'appid': APIKeys.OWM }

    for k,v in customParams.items():
        sParams[k] = v

    if not sParams.get('units',None):
        sParams['units'] = 'imperial'

    r = requests.get('https://api.openweathermap.org/data/2.5/weather',
        params=sParams,
    )
    print(r.url)

    if r.status_code == 200:
        data = r.json()
        wData['OWM'] = data
    else:
        wData['success'] = False
        wData['error'] = 'OWM API failed. (HTTP '+str(r.status_code)+')'
    end = time.time()
    TIMING['OWM'] = round(end-start,2)
TIMING = {}
