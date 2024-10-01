from flask import Blueprint
from src import app

"""
    Desc: Creates flask blueprints.
    Args:
        view_path: Realtive path to view.
        url_prefix: URL prefix passed to the blueprint.
    Returns:
        A constructed blueprint.
"""
def Initialize(view_path, url_prefix):
    return Blueprint(
        view_path,
        'src.views.{}'.format(view_path),
        url_prefix=url_prefix
    )

general      = Initialize('general', '/')
web_parts     = Initialize('web_parts','/parts')
api          = Initialize('api','/API')
app_images    = Initialize('app_images','/app/images')


blueprint_list = (
    general,
    web_parts,
    api,
    app_images
)
