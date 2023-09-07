__ERROR_MESSAGE = {
    'user': {
        'email': {
            'exist': 'Email exist'
        },
        'password':{

        }
    },
}

def error_message(key: str):
    try:
        tmp = __ERROR_MESSAGE
        for target in key.split('.'):
            tmp = tmp[target]
        return tmp
    except:
        return None
