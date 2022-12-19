class LocalWeather {
    constructor (lat,lng,locationName=null) {
        this.lat = lat;
        this.lng = lng;
        this.coords = lat.toFixed(3)+','+lng.toFixed(3);

        this.locationName = locationName;
    }
    isCacheValid() {
        return (this._pullCache()) ? true : false;
    }
    

    getWeather(callback) {
        if (this.isCacheValid()) {
            DEBUG('Pulling cached weather from: '+this.lat+', '+this.lng);
            if (typeof callback === 'function') callback(this._pullCache());
        } else {
            this._fetchServer(callback);
        }
    }

    _pullCache() {
        var data = weather.cache()[this.coords]

        if (data) { // if cached data exists
            var fetchHour = txtFormat.hour(data.fetch);
            var currentHour = txtFormat.hour(Date.now())
            var timeDiff = (Date.now()-data.fetch)/1000;

            var wasFetchThisHour = fetchHour == currentHour;
            var wasFetchLT30MinAgo = timeDiff < 60*30;


            if (wasFetchLT30MinAgo && wasFetchThisHour) { 
                return data;
            }
            //invalidating existing record
            DEBUG('Invalidating cache: '+this.coords);
            weather.cache(this.coords,null);
        }
        return false;
    }

    _fetchServer(callback) {
        DEBUG('Fetching weather from: '+this.lat+', '+this.lng);
        //.push() returns index of new item
        var start = new Date();
        $.getJSON('/API/weatherLookup'+
            '?latitude='+this.lat+
            '&longitude='+this.lng+
            '&units='+app.settings().units,
            function(serverData){
                var data = {
                    w: serverData,
                    lat: parseFloat(serverData.call.latitude).toFixed(3),
                    lng: parseFloat(serverData.call.longitude).toFixed(3),
                    fetch: Date.now()
                }

                if (data.w.success) {
                    data.w.timing.client = ((new Date()).getTime() - start.getTime()) / 1000;
                    data.w.timing.tx_rx = data.w.timing.client - data.w.timing.serverTotal;
                    weather.cache(data.lat+','+data.lng,data);
                    weather.debugTiming(data);
                    
                    if (typeof callback === 'function') callback(data);
                } else {
                    n.info('Weather Fetch failed. ', data.w.error);
                }
            }
        ).fail(function(){
            n.info('Weather Fetch failed. ', 'Uncaught server error.');
        });
    }

    
    


    
}