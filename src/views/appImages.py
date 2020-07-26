from src.blueprints import appImages
from src.libraries import general

from flask import (
    send_file,
    request
)
# /app/images/_____

#####################################################
#       Image Resizing/Path Redirection
#####################################################

@appImages.route('/site-thumbnail.jpg')
def siteThumbnail():
    clientIP = request.remote_addr
    clientIP = '99.71.157.139' if clientIP == '127.0.0.1' else clientIP
    image = general.websiteThumbnail(clientIP)
    return send_file(image,mimetype='image/png',as_attachment=False)


@appImages.route('/<path:imagePath>')
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
