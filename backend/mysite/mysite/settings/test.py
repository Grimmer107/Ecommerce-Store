from .base import *

DEBUG = True

ROOT_URLCONF = 'mysite.mysite.urls'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
