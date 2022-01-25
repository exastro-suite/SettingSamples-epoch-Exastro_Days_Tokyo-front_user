#   Copyright 2021 NEC Corporation
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

import os

from flask import Blueprint, render_template, request, session
from logging import getLogger
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

user_login_app = Blueprint("user_login", __name__, template_folder="templates")
logger = getLogger(__name__)

@user_login_app.route("/", methods=["GET"])
def user_login():
    logger.info("call: user_login")

    sso_authc_data = {
        "google": {
            "client_id": os.environ.get('SSO_GOOGLE_CLIENT_ID', None),
        },
        "github": {
            "client_id": os.environ.get('SSO_GITHUB_CLIENT_ID', None),
        },
        "twitter": {
            "client_id": os.environ.get('SSO_TWITTER_CLIENT_ID', None),
        },
    }

    return render_template(
        "login/user_login.html", sso_authc_data=sso_authc_data
    )

@user_login_app.route("/login_succeeded", methods=["POST"])
def login_succeeded():
    logger.info("call: login_succeeded")

    try:
        id_token = request.json.get('id_token')
        user_id, user_name = _get_userinfo(id_token)

        session['user_id'] = user_id
        session['name'] = user_name

        # debug
        logger.info(session.sid)
        logger.info(session)

    except Exception as e:
        raise

    return '', 204

def _get_userinfo(id_token):
    logger.info("call: _get_userinfo")

    try:
        # -+-+- workaround -+-+-
        os.environ['CURL_CA_BUNDLE'] = ''
        # -+-+- workaround -+-+-

        # Specify the CLIENT_ID of the app that accesses the backend:
        GOOGLE_CLIENT_ID = os.environ.get('SSO_GOOGLE_CLIENT_ID', None)
        idinfo = google_id_token.verify_oauth2_token(id_token, google_requests.Request(), GOOGLE_CLIENT_ID)

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        user_id = idinfo['sub']
        user_name = idinfo['name']

    except ValueError:
        # Invalid token
        logger.info("Invalid token")
        raise

    return user_id, user_name
