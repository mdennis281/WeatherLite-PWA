import requests, threading,time,datetime

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
                imperial || metric

    """
    def __init__(self,coords,**kwargs):
        self.lat, self.lon = coords
        self.units = kwargs.get('units','imperial')
        self.result = {}
        self.threads = []
        self.timing = {}

    def getHourly(self, fields=None,**kwargs):
        if not fields:
            fields = kwargs.pop('fields','temperature,temperatureApparent,humidity,windSpeed,windDirection,windGust,precipitationIntensity,precipitationType,precipitationProbability,visibility,cloudCover,weatherCode')
        return self._callAPI(
            'hourly',
            '/timelines',
            fields,
            '1h',
            **kwargs
        )

    def getDaily(self, fields=None,**kwargs):
        if not fields:
            fields = kwargs.pop('fields','temperature,temperatureMin,temperatureMax,temperatureApparent,humidity,windSpeed,windDirection,windGust,precipitationIntensity,precipitationType,precipitationProbability,visibility,cloudCover,weatherCode')
        return self._callAPI(
            'daily',
            '/timelines',
            fields,
            '1d',
            **kwargs
        )

    def join(self):
        for T in self.threads:
            T.join()

    @staticmethod
    def getWeather(coords,**kwargs):
        kwargs['thread'] = True
        start = time.time()
        W = WeatherData(coords,**kwargs)
        kwargs['endTime'] = ISO8601.addHrs(kwargs.pop('hourly_limit',24))
        W.getHourly(kwargs.get('hourlyFields'),**kwargs)
        kwargs['endTime'] = ISO8601.addDays(kwargs.pop('days_limit',7))
        W.getDaily(kwargs.get('dailyFields'),**kwargs)

        W2 = WeatherInfo(coords[0],coords[1])
        W2.getOWM()

        W.join()
        W2.waitUntilComplete()

        ans = {'error':False}
        for k,v in W.result.items():
            if not v.get('error'):
                ans[k] = v['data']
            else:
                ans['error'] = v['message']
        ans['OWM'] = W2.data.get('OWM')
        ans['success'] = (not ans['error']) and (not W2.fail)

        W.timing['serverTotal'] = time.time() - start
        W.timing['OWM'] = W2.timing['OWM']
        ans['timing'] = W.timing


        return ans




    def _callAPI(self,callName,endpoint,fields,timeSteps,**kwargs):
        url = 'https://api.tomorrow.io/v4' + endpoint
        params = {}
        params['apikey'] = APIKEY
        params['fields'] = fields
        params['units'] = kwargs.get('units',self.units)
        lat = kwargs.get('lat',self.lat)
        lon = kwargs.get('lon',self.lon)
        params['location'] = lat+','+lon
        params['timesteps'] = timeSteps
        #params['endTime'] = kwargs.get('endTime',None)
        if kwargs.pop('thread',False):
            T = threading.Thread(target=self._makeThreadRequest,args=(callName,url,params))
            T.start()
            self.threads.append(T)
            return True

        return self._makeRequest(url,params)

    def _makeThreadRequest(self,callName,url,params):
        start = time.time()
        data = self._makeRequest(url,params)
        data = data
        """
        try: #this sucks

        except:
            pass
        """
        self.result[callName] = data
        self.timing[callName] = time.time() - start


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
            'data': data['data']['timelines'][0]['intervals']
        }


class ISO8601:
    @staticmethod
    def addHrs(hours):
        now = datetime.datetime.now()
        ahead = datetime.timedelta(hours=hours)
        ans = now+ahead
        return ans.isoformat()
    def addDays(days):
        now = datetime.datetime.now()
        ahead = datetime.timedelta(days=days)
        ans = now+ahead
        return ans.isoformat()
