import json
import requests

PAYLOAD_PATH = './payload.json'
URL = 'https://api.react-svgr.com/api/svgr'
USER_AGENT = 'Mozilla/5.0 (X11; CrOS aarch64 15048.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
PAYLOAD = {}

def getPayload(code: str) -> dict:
    '''
    Get payload for the request with code.

    Parameters
    ----------
    code : str
        The svg content.
    '''

    global PAYLOAD

    # Get payload from file if not already done
    if PAYLOAD == {}:
        f = open(PAYLOAD_PATH, 'r')
        if f is None:
            print('Payload file not found')
        PAYLOAD = json.load(f)
        f.close()

    newPayload = PAYLOAD.copy()
    newPayload['code'] = code
    newPayload['options'] = {
        "descProp": False,
        "dimensions": True,
        "expandProps": "end",
        "exportType": "default",
        "icon": False,
        "jsxRuntime": "classic",
        "memo": False,
        "namedExport": "ReactComponent",
        "native": True,
        "prettier": True,
        "prettierConfig": {
            "semi": True
        },
        "ref": False,
        "replaceAttrValues": {},
        "svgo": True,
        "svgoConfig": {
            "plugins": [
                {
                    "name": "preset-default",
                    "params": {
                        "overrides": {
                            "removeTitle": False
                        }
                    }
                }
            ]
        },
        "svgProps": {},
        "titleProp": False,
        "typescript": False
    }
    return newPayload

def convertSvgToRN(svg: str):
    '''
    Convert svg text to react-native text.

    Parameters
    ----------
    svg : str
        The svg text.

    Returns
    -------
    str
        The react-native text or None if failed.
    '''

    payload = getPayload(svg)

    try:
        response = requests.post(URL, json=payload, headers={'User-Agent': USER_AGENT})
        if response.status_code == 200:
            output = response.json()
            return output['output']
        else:
            print('SVG conversion failed ({})'.format(response.status_code))
    except Exception as e:
        print('SVG conversion failed')
        print(e)

    return None
