from src.blueprints import general
from src.libraries import (
####    Flask
    render_template
)


#####################################################
#       Load Base Document
#####################################################
@general.route('/')
def main():
    return render_template('init.html')
