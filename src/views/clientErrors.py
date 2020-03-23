from src.blueprints import clientErrors
from src.libraries import (
####    Flask
    jsonify,
    request,
####    External
    time,
####    Internal
    errorLogging
)



#####################################################
#       Error Logging
#####################################################

@clientErrors.route('/submit',methods=['POST'])
def errorLogger():
    errorLogging.add(
        (
            request.form['message'],
            request.form['url'],
            int(request.form['line']),
            request.remote_addr,
            request.headers.get('User-Agent'),
            time.strftime('%Y-%m-%dT%H:%M:%S', time.gmtime())+'.'+
                str(time.time()).split('.')[1]
        )
    )
    return jsonify({'success':True})
