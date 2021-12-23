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

logger = getLogger(__name__)


def get_events():
    logger.debug("Method called.")

    base_url = create_base_url()
    api_path = '/api/v1/event'
    header = create_header()
    body = {}

    event_list = []
    try:
        # 取得
        logger.debug("request_url: {}".format(base_url + api_path))
        response = requests.get(base_url + api_path, headers=header, data=json.dumps(body))
        if response.status_code != 200:
            raise Exception(response)

        event_list = response.json()

    except Exception as e:
        logger.debug(e)
        logger.debug("traceback:" + traceback.format_exc())

        # todo

    return event_list

def get_event_detail(event_id):
    logger.debug("Method called.")

    base_url = create_base_url()
    api_path = '/api/v1/event/{}'.format(event_id)
    header = create_header()
    body = {}

    event_detail = {}
    try:
        # 取得
        logger.debug("request_url: {}".format(base_url + api_path))
        response = requests.get(base_url + api_path, headers=header, data=json.dumps(body))
        if response.status_code != 200:
            raise Exception(response)

        event_detail = response.json()

    except Exception as e:
        logger.debug(e)
        logger.debug("traceback:" + traceback.format_exc())

        # todo

    return event_detail

def get_timetable(event_id, user_id = None, kind_of_sso = None):
    logger.debug("Method called.")

    base_url = create_base_url()
    api_path = '/api/v1/seminar'
    header = create_header()
    body = {"event_id": event_id}

    if user_id:
        body['user_id'] = user_id
    if kind_of_sso:
        body['kind_of_sso'] = kind_of_sso

    event_timetable = []
    try:
        # 取得
        logger.debug("request_url: {}".format(base_url + api_path))
        response = requests.get(base_url + api_path, headers=header, data=json.dumps(body))
        if response.status_code != 200:
            raise Exception(response)

        event_timetable = response.json()

    except Exception as e:
        logger.debug(e)
        logger.debug("traceback:" + traceback.format_exc())

        # todo

    return event_timetable

def create_header():
    # ヘッダ情報
    header = {
        'Content-Type': 'application/json',
    }

    return header

def create_base_url():

    protocol = os.environ['SERVICE_EVENT_PROTOCOL']
    host = os.environ['SERVICE_EVENT_HOST']
    port = os.environ['SERVICE_EVENT_PORT']

    return protocol + '://' + host + ':' + port
