from src.blueprints import webParts
from src.libraries import (
####    Flask
    render_template,
    redirect

)

# /parts/*

#####################################################
#       HTML Web Parts
#####################################################


@webParts.route('/<part>')
def getPart(part):
    try:
        return render_template('/parts/'+part+'.html')
    except:
        return redirect('/404')
