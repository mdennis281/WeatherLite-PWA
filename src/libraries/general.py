from src.libraries import Image,io,requests

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

def appleTouchIcon():
    logo = Image.open(imageResizer('appIcon.png',160,160))
    ico = Image.new("RGB",(180,180),(11, 19, 43))
    ico.paste(logo,(10,10),logo)
    output = io.BytesIO()
    ico.save(output,format='PNG')
    output.seek(0,0)
    return output



def IP2Coords(IP):
    position = {}
    data = requests.get('https://tools.keycdn.com/geo.json?host='+IP).json()
    position['latitude'] = data['data']['geo']['latitude']
    position['longitude'] = data['data']['geo']['longitude']
    return position
