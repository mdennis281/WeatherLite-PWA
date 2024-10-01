from dotenv import load_dotenv
import os


load_dotenv()

APIKeys = {
    'OWM' : os.getenv('OWM'),
    'GCP' : os.getenv('GCP'),
    'tomorrow' : os.getenv('tomorrow'),
    'GAnalytics' : os.getenv('GAnalytics')
}