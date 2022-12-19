var uiSettings = {
    //called when opening the page
    loadContext: function() {
      ui.settings.onlineMode.genToggle();
      ui.settings.units.genToggle();
      ui.settings.sw.init();
    },
    //refers to the onlinemode toggle btn
    onlineMode: {
      //defines what JS is run when the onlinemode toggle button
      //is toggled on and off
      genToggle: function() {
        general.createToggle(
          '#cached-mode-toggle', //parentElement
          !(app.devMode.isEnabled()), //isToggled
          function() { //Toggle off callback
            app.devMode.enable();
          },
          function() { //Toggle on callback
            app.devMode.disable();
          }
        )
      }
    },
    units: {
      genToggle: function() {
        general.createToggle(
            '#units-toggle', //parentElement
            (app.settings().units == 'metric'), //isToggled
            function() { //Toggle off callback
              app.settings('units','imperial');
              app.storage('weatherCache',{});
              app.refresh();
            },
            function() { //Toggle on callback
              app.settings('units','metric');
              app.storage('weatherCache',{});
              app.refresh();
            }
          )
      }
    },
    debug: {
      weatherData: function() {
        popup.open('<div style="text-align:left; width:100%"> <pre style="color:#fff">' + JSON.stringify(weather.cache(),null,'  ') + '</pre></div>');
      },
      weatherTiming: function() {
        var buffer = '';
        Object.keys(weather.cache()).forEach(function(key){
          if (key != 'last') {
            var timing = weather.cache()[key].w.timing;
            var city = weather.cache()[key].w.OWM.name
            buffer += `
              <h3>${city}:</h3>
              <p>Client (total): ${timing.client.toFixed(3)}s</p>
              <div class="timer-box">
                <p>TX/RX: ${timing.tx_rx.toFixed(3)}s</p>
                <div class="timer-box">
                  <p>Server: ${timing.serverTotal.toFixed(3)}s</p>
                    <div class="timer-box">
                      <p>Daily: ${timing.daily.toFixed(3)}s</p>
                      <p>Hourly: ${timing.hourly.toFixed(3)}s</p>
                      <p>OWM: ${timing.OWM.toFixed(3)}s</p>
                    </div>
                </div>
              </div>
              <hr />
            `
          }
        });
        popup.open(buffer)

      }
    },
    sw: {
        init: function() {
            var swStatus = app.storage('sw-status');
            if (swStatus && swStatus.state) {
                $('#sw-state').html(swStatus.state);
                $('#sw-caches').html(JSON.stringify(swStatus.caches));
                $('#sw-requests').html(`
                    <a onclick="ui.settings.sw.showReqs()" href="#">
                        ${swStatus.requests.length}
                    </a>
                `);

                if (swStatus.state == 'activated') {
                    $('#sw-state').addClass('text-success');
                } else {
                    $('#sw-state').addClass('text-warning');
                }
            } else {
                $('#sw-state').html('uninitialized');
                setTimeout(() => { ui.settings.sw.init() },1000);
            }
            
        }
    }
  }