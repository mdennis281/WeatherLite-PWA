from src.libraries.config import APIKeys

import requests
"""
    converts location to coords with GCP geocoding API
    args:
        location : string of location
    returns:
        {latitude: <val>, longitude: <val>}
"""
def geocoding(location):
    params = {
        'address': location,
        'key': APIKeys['GCP']
    }

    data = requests.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        params=params
    ).json()

    return data['results'][0]['geometry']['location']


"""
    Converts a partial location string to options for a full location string
    Args:
        Required:
            query : partial location string
        Optional:
            debug : will not filter results for addresses
                        (dont need addresses for weather info)
    Returns: 
    {
        'success': boolean,
        'error': null || string,
        'data': list
    }
"""
def places(query,debug=False):
    def filterResults(locations):
        results = []
        badTypes = ['establishment','street_address','premise','route']
        for location in locations:
            if not any(item in location['types'] for item in badTypes):
                results.append(location['description'])
        return results


    params = {
        'input': query,
        'key': APIKeys['GCP'],
    }
    data = requests.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        params=params
    ).json()


    if debug: return data['predictions']

    if data['status'] in ['OK','ZERO RESULTS']:
        return { 
            'success': True, 
            'data': filterResults(data['predictions']) 
        }
    return { 
        'success': False,
        'error': data['error_message'],
        'data': []
    }

