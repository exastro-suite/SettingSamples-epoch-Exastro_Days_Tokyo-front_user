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

from datetime import datetime
from flask import Blueprint, render_template, request, jsonify, session
from logging import getLogger
from operator import attrgetter

from front_user.models import seminar

seminar_app = Blueprint("seminar", __name__, template_folder="templates")
logger = getLogger(__name__)

@seminar_app.route("/<int:seminar_id>", methods=["GET"])
def seminar_detail(seminar_id):
    logger.info("call: seminar_detail [seminar_id={}]".format(seminar_id))

    user_id = session.get('user_id', '')
    kind_of_sso = 'google'

    seminar_detail = seminar.get_seminar_detail(seminar_id, user_id, kind_of_sso)

    logger.debug(json.dumps(seminar_detail))

    return jsonify({'result': seminar_detail})
