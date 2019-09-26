from src.libraries import Image,io

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
