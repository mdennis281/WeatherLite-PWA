from jinja2 import TemplateNotFound
from flask import render_template, abort
from src.blueprints import web_parts
from flask import (
####    Flask
    render_template,
    redirect

)

# /parts/*

#####################################################
#       HTML Web Parts
#####################################################


@web_parts.route('/<part>')
def getPart(part):
    try:
        return render_template('/parts/'+part+'.html')
    except TemplateNotFound:
        abort(404)
