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
import requests

from flask import Blueprint, render_template, request
from logging import getLogger
from google.oauth2 import id_token
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
            "client_id": os.environ['SSO_GITHUB_CLIENT_ID'],
            "client_secret": os.environ['SSO_GITHUB_CLIENT_SECRET'],
        },
        "twitter": {
            "client_id": os.environ['SSO_TWITTER_CLIENT_ID'],
            "client_secret": os.environ['SSO_TWITTER_CLIENT_SECRET'],
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
        # Specify the CLIENT_ID of the app that accesses the backend:
        GOOGLE_CLIENT_ID = os.environ.get('SSO_GOOGLE_CLIENT_ID', None)
        idinfo = id_token.verify_oauth2_token(id_token, google_requests.Request(), GOOGLE_CLIENT_ID)

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        logger.info("debug: userid=" + userid)

    except ValueError:
        # Invalid token
        logger.warn("Invalid token")
