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
import os
import requests
import traceback

from logging import getLogger

from front_user.models.dto import EventHeading

logger = getLogger(__name__)


def getEvents():
    logger.debug("Method called.")

    base_url = createBaseUrl()
    api_path = '/api/v1/event'
    header = createHeader()
    body = {}

    event_list = []
    try:
        # 取得
        logger.debug("request_url: {}".format(base_url + api_path))
        response = requests.get(base_url + api_path, headers=header, data=json.dumps(body))
        if response.status_code != 200:
            raise Exception(response)

        event_list = [ EventHeading(event_json[0], event_json[1], event_json[2]) for event_json in enumerate(response.json)]

    except Exception as e:
        logger.debug(e)
        logger.debug("traceback:" + traceback.format_exc())

        # todo

    return event_list

def createHeader():
    # ヘッダ情報
    header = {
        'Content-Type': 'application/json',
    }

    return header

def createBaseUrl():

    protocol = os.environ['SERVICE_EVENT_PROTOCOL']
    host = os.environ['SERVICE_EVENT_HOST']
    port = os.environ['SERVICE_EVENT_PORT']

    return protocol + '://' + host + ':' + port