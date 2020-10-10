import requests, threading,time

from src.libraries.APIKeys import climacell as APIKEY

from src.libraries.weather import WeatherInfo

class WeatherData:
    """
    Params:
        *coords (tuple *float[2])
            Example:
                (29.21,-95.37)
        kwargs.units (string)
            Accepted vals:
                us || si

    """
    def __init__(self,coords,**kwargs):
        self.lat, self.lon = coords
        self.units = kwargs.get('units','us')
        self.result = {}
        self.threads = []
        self.timing = {}

    def getHourly(self, fields=None,**kwargs):
        if not fields:
            fields = kwargs.pop('fields','temp,feels_like,humidity,wind_speed,wind_direction,wind_gust,precipitation,precipitation_type,precipitation_probability,visibility,cloud_cover,weather_code')
        return self._callAPI(
            '/weather/forecast/hourly',
            fields,
            **kwargs
        )

    def getDaily(self, fields=None,**kwargs):
        if not fields:
            fields = kwargs.pop('fields','temp,feels_like,humidity,wind_speed,wind_direction,precipitation,precipitation_probability,visibility,weather_code,sunrise,sunset')
        return self._callAPI(
            '/weather/forecast/daily',
            fields,
            **kwargs
        )

    def join(self):
        print(self.threads)
        for T in self.threads:
            T.join()

    @staticmethod
    def getWeather(coords,**kwargs):
        kwargs['thread'] = True
        start = time.time()
        W = WeatherData(coords,**kwargs)

        W.getHourly(kwargs.get('hourlyFields'),**kwargs)
        W.getDaily(kwargs.get('dailyFields'),**kwargs)
        W.join()

        W2 = WeatherInfo(coords[0],coords[1])
        W2.getOWM()
        W2.waitUntilComplete()


        ans = {'error':False}
        for k,v in W.result.items():
            if not v.get('error'):
                ans[k] = v['data']
            else:
                ans['error'] = v['message']
        ans['OWM'] = W2.data.get('OWM')
        print(ans['error'])
        ans['success'] = (not ans['error']) and (not W2.fail)

        W.timing['serverTotal'] = time.time() - start
        W.timing['OWM'] = W2.timing['OWM']
        ans['timing'] = W.timing

        return ans




    def _callAPI(self,endpoint,fields,**kwargs):
        url = 'https://api.climacell.co/v3' + endpoint
        params = {}
        params['apikey'] = APIKEY
        params['fields'] = fields
        params['unit_system'] = kwargs.get('units',self.units)
        params['lat'] = kwargs.get('lat',self.lat)
        params['lon'] = kwargs.get('lon',self.lon)
        if kwargs.pop('thread',False):
            T = threading.Thread(target=self._makeThreadRequest,args=(url,params))
            T.start()
            self.threads.append(T)

        return self._makeRequest(url,params)

    def _makeThreadRequest(self,url,params):
        start = time.time()
        self.result[url.split('/')[-1]] = self._makeRequest(url,params)
        self.timing[url.split('/')[-1]] = time.time() - start


    def _makeRequest(self,url,params):
        try:
            r = requests.get(url,params=params)
            data = r.json()
        except JSONDecodeError:
            return {
                'error': True,
                'message': 'API did not return valid json'
            }
        except:
            return {
                'error': True,
                'message': 'uncaught error connecting to API'
            }

        if r.status_code != 200:
            errMsg = data['message']
            return {
                'error': True,
                'message': '['+str(r.status_code)+'] '+errMsg
            }

        return {
            'error': False,
            'data': data
        }
