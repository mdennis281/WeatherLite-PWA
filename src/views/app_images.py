from src.blueprints import app_images
from src.libraries import general

from flask import (
    send_file,
    request
)
# /app/images/_____

#####################################################
#       Image Resizing/Path Redirection
#####################################################


@app_images.route('/<path:imagePath>')
def customImage(imagePath,imageWidth=None, imageHeight=None):
    if not imageWidth:
        imageWidth = request.args.get('width')
        if imageWidth:
            imageWidth = int(imageWidth)
    if not imageHeight:
        imageHeight = request.args.get('height')
        if imageHeight:
            imageHeight = int(imageHeight)

    image = general.imageResizer(imagePath,imageWidth,imageHeight)
    return send_file(image,mimetype='image/png',as_attachment=False)
