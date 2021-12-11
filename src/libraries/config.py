import configparser


settings = configparser.ConfigParser()
settings.read('config.ini')

APIKeys = settings['APIKeys']