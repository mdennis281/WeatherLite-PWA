from src import app as application
import os

application.secret_key = os.environ.get('SECRET_KEY', os.urandom(24))
application.run(host="0.0.0.0", debug=True)
