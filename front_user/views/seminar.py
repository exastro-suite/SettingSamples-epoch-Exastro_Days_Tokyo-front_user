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

import json

from flask import Blueprint, request, jsonify, session
from logging import getLogger

from ..models import seminar
from ..models import speaker

seminar_app = Blueprint("seminar", __name__, template_folder="templates")
logger = getLogger(__name__)

@seminar_app.route("/seminar/<int:seminar_id>", methods=["GET"])
def seminar_detail(seminar_id):
    logger.info("call: seminar_detail [seminar_id={}]".format(seminar_id))

    user_id = session.get('user_id', '')
    kind_of_sso = 'google'

    seminar_detail = seminar.get_seminar_detail(seminar_id, user_id, kind_of_sso)
    speaker_data = speaker.get_speaker_detail(seminar_detail['speaker_id'])
    seminar_detail['speaker_name'] = speaker_data['speaker_name']
    seminar_detail['speaker_profile'] = speaker_data['speaker_profile']

    logger.debug(json.dumps(seminar_detail))

    return jsonify({'result': seminar_detail})

@seminar_app.route("/signup_seminar", methods=["POST"])
def signup_seminar():
    logger.info("call: signup_seminar")

    user_id = session.get('user_id', '')
    user_name = session.get('name', '')
    kind_of_sso = 'google'
    seminar_id = request.json.get('seminar_id')

    #logger.debug("seminar_id: {}, user_id: {}, kind_of_sso:{}".format(seminar_id, user_id, kind_of_sso))
    seminar.signup_seminar(seminar_id, user_id, user_name, kind_of_sso)

    return '', 201

@seminar_app.route("/cancel_seminar", methods=["POST"])
def cancel_seminar():
    logger.info("call: cancel_seminar")

    user_id = session.get('user_id', '')
    kind_of_sso = 'google'
    seminar_id = request.json.get('seminar_id')

    #logger.debug("seminar_id: {}, user_id: {}, kind_of_sso:{}".format(seminar_id, user_id, kind_of_sso))
    seminar.cancel_seminar(seminar_id, user_id, kind_of_sso)

    return '', 204
