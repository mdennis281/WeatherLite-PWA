from src.libraries import psycopg2
from src.libraries.APIKeys import PSQL

class DBConn:
    def __init__(self,**kwargs):
        self.user = kwargs.get('user',None)
        self.PW   = kwargs.get('PW'  ,None)
        self.host = kwargs.get('host',None)
        self.port = kwargs.get('port',None)
        self.DB   = kwargs.get('DB'  ,None)
    def connect(self):
        self.CONN = psycopg2.connect(
            user     = self.user,
            password = self.PW,
            host     = self.host,
            port     = self.port,
            database = self.DB
        )
    def cursor(self):
        if not self.CONN: self.connect()

        return self.CONN.cursor()
    def commit(self):
        self.CONN.commit()
        self.connect()
        return True



WLDB = DBConn(
    user = PSQL['user'],
    PW   = PSQL['PW'],
    host = PSQL['host'],
    port = PSQL['port'],
    DB   = PSQL['DB']
)
WLDB.connect()
