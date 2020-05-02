from src.libraries import io,requests,weather,textwrap
from PIL import Image, ImageDraw, ImageFont
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

#generates a website thumbnail dependant
#on the location of the IP address of the requestor.
def websiteThumbnail(IP):
    wInfo = weather.getWeatherByCoords(IP2Coords(IP))
    thumbnail = Image.new("RGBA",(1200,630),(11, 19, 43))
    divider = Image.new("RGBA",(2,500),(204, 204, 204))
    logo = Image.open(imageResizer('appIcon.png',180,180))
    font = {
        'WL': ImageFont.truetype('./src/static/font/Inconsolata-Regular.ttf', 60),
        'temp': ImageFont.truetype('./src/static/font/Inconsolata-Regular.ttf', 90),
        'city': ImageFont.truetype('./src/static/font/Inconsolata-Regular.ttf', 50),
        'desc': ImageFont.truetype('./src/static/font/Inconsolata-Regular.ttf', 40)
    }
    thumbnail.paste(logo,(100,157),logo)
    thumbnail.paste(divider,(398,65),divider)
    d = ImageDraw.Draw(thumbnail)
    d.text(
        (40,360),
        "WeatherLite",
        font=font['WL'],
        fill=(204, 204, 204)
    )
    d.text(
        (440,187),
        str(wInfo['NOAA']['hourly']['properties']['periods'][0]['temperature'])+'°F',
        font=font['temp'],
        fill=(204, 204, 204)
    )
    d.text(
        (440,295),
        wInfo['NOAA']['base']['properties']['relativeLocation']['properties']['city'],
        font=font['city'],
        fill=(204, 204, 204)
    )
    desc = "\n".join(textwrap.wrap(
        wInfo['NOAA']['hourly']['properties']['periods'][0]['shortForecast'],
        width=36
    ))
    d.text(
        (440,370),
        desc,
        font=font['desc'],
        fill=(204, 204, 204)
    )
    output = io.BytesIO()
    thumbnail.save(output,format='PNG')
    output.seek(0,0)
    return output

#converts an IP address to coordinates
def IP2Coords(IP):
    position = {}
    data = requests.get('https://tools.keycdn.com/geo.json?host='+IP).json()
    position['latitude'] = data['data']['geo']['latitude']
    position['longitude'] = data['data']['geo']['longitude']
    return position
