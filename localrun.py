import sys
from src import app as application
application.secret_key = '54685'


application.run(host="0.0.0.0")
