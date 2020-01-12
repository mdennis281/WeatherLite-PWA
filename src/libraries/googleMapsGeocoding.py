from src.libraries import (
    requests,
    APIKeys
)

def lookup(location):
    params = {
        'address': location,
        'key': APIKeys.GCP
    }

    data = requests.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        params=params
    )

    return data.json()
