from src.libraries import (
    requests,
    APIKeys
)


def geocoding(location):
    params = {
        'address': location,
        'key': APIKeys.GCP
    }

    data = requests.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        params=params
    ).json()

    return data['results'][0]['geometry']['location']

def places(query,debug):
    def filterResults(locations):
        results = []
        badTypes = ['establishment','street_address','premise','route']
        for location in locations:
            if not any(item in location['types'] for item in badTypes):
                results.append(location['description'])
        return results


    params = {
        'input': query,
        'key': APIKeys.GCP,
    }
    data = requests.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        params=params
    ).json()


    if debug: return data['predictions']
    return filterResults(data['predictions'])
