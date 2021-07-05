from src.libraries import weather
import requests
import textwrap
import json
import io

from PIL import Image

"""
resizes an image
Args:
    required:
        imagePath : path to img wihin ./src/static/img
        width : pixel width
    optional:
        height : pixel height | will constrain proportions if unspecified
    returns:
        PNG image
"""
def imageResizer(imagePath,width,height):
    imagePath = './src/static/img/' + imagePath
    img = Image.open(imagePath)
    if not height: #will maintain aspect ratio if undefined.
        wpercent = (width/float(img.size[0]))
        height = int((float(img.size[1])*float(wpercent)))
    img = img.resize((width,height), Image.ANTIALIAS)
    output = io.BytesIO()
    img.save(output, format='PNG')
    output.seek(0,0)
    return output

#returns an image of the apple touch icon
# it grabs the logo and puts a background behind it
def appleTouchIcon():
    logo = Image.open(imageResizer('appIcon.png',160,160))
    ico = Image.new("RGB",(180,180),(11, 19, 43))
    ico.paste(logo,(10,10),logo)
    output = io.BytesIO()
    ico.save(output,format='PNG')
    output.seek(0,0)
    return output

#converts an IP address to coordinates
def IP2Coords(IP):
    position = {}
    headers = {'User-Agent': 'keycdn-tools:https://weatherlite.app'}
    data = requests.get('https://tools.keycdn.com/geo.json?host='+IP,headers=headers).json()
    position['latitude'] = data['data']['geo']['latitude']
    position['longitude'] = data['data']['geo']['longitude']
    return position

#returns current version of app from appInfo.json
def getAppVersion():
    f = open('appInfo.json')
    data = f.read()
    f.close()

    data = json.loads(data)

    return data['version']
