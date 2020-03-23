from src.libraries import Blueprint
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
webParts     = Initialize('webParts','/parts')
API          = Initialize('API','/API')
clientErrors = Initialize('clientErrors','/clientErrors')
appImages    = Initialize('appImages','/app/images')


all = (
    general,
    webParts,
    API,
    clientErrors,
    appImages
)
