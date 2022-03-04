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



def get_speaker(speaker_id_list):
    logger.debug("Method called.")

    base_url = _create_base_url()
    api_path = '/api/v1/speaker'
    header = create_header()
    params = {"speaker_id": speaker_id_list}

    speakers = {}
    try:
        # 取得
        logger.debug("request_url: {}, params: {}".format(base_url + api_path, json.dumps(params)))
        response = requests.get(base_url + api_path, headers=header, params=params)
        if response.status_code != 200:
            raise Exception(response)

        speakers = response.json()

    except Exception as e:
        logger.debug(e)
        logger.debug("traceback:" + traceback.format_exc())

        # todo

    return speakers

def get_speaker_detail(speaker_id):
    logger.debug("Method called.")

    base_url = _create_base_url()
    api_path = '/api/v1/speaker/{}'.format(speaker_id)
    header = create_header()
    body = {}

    speaker = {}
    try:
        # 取得
        logger.debug("request_url: {}".format(base_url + api_path))
        response = requests.get(base_url + api_path, headers=header, data=json.dumps(body))
        if response.status_code != 200:
            raise Exception(response)

        speaker = response.json()

    except Exception as e:
        logger.debug(e)
        logger.debug("traceback:" + traceback.format_exc())

        # todo

    return speaker

def create_header():
    # ヘッダ情報
    header = {
        'Content-Type': 'application/json',
    }

    return header

def _create_base_url():

    protocol = os.environ['SERVICE_SPEAKER_PROTOCOL']
    host = os.environ['SERVICE_SPEAKER_HOST']
    port = os.environ['SERVICE_SPEAKER_PORT']

    return protocol + '://' + host + ':' + port
