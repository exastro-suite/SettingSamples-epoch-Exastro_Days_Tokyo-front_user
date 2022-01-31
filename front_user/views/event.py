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

from datetime import datetime
from flask import Blueprint, render_template, request, jsonify, session
from logging import getLogger
from operator import attrgetter

from front_user.models import event

event_app = Blueprint("event", __name__, template_folder="templates")
logger = getLogger(__name__)

@event_app.route("/", methods=["GET"])
def eventList():
    logger.info("call: event")

    events = event.get_events()

    upcomings = [x for x in events if str_to_datetime(x['event_date']) > datetime.now()]
    upcomings = sorted(upcomings, key=lambda x:x['event_date'], reverse=True)
    upcomings = [
        {
            'event_path': x['event_id'],
            'event_name': x['event_name']
        } for x in upcomings
    ]

    archives = [x for x in events if str_to_datetime(x['event_date']) <= datetime.now()]
    archives = sorted(archives, key=lambda x:x['event_date'], reverse=True)
    archives = [
        {
            'event_path': x['event_id'],
            'event_name': x['event_name']
        } for x in archives
    ]

    return render_template(
        "event/event.html", upcomings=upcomings, archives=archives
    )

@event_app.route("/<int:event_id>", methods=["GET"])
def eventDetail(event_id):
    logger.info("call: eventDetail [event_id={}]".format(event_id))

    user_info = {
        'login': session.get('login', False),
        'name': session.get('name', ''),
    }

    event_detail = event.get_event_detail(event_id)
    event_detail['event_date'] = event_detail['event_date']

    header_data = {
        "event_name": event_detail['event_name'],
        "menu_item_list": [
            {
                "name": "event list",
                "url_path": "/",
            },
            {
                "name": "timetable",
                "url_path": "/{}/timetable".format(event_id),
            }
        ],
    }

    return render_template(
        "event/event_detail.html", user_info=user_info, header_data=header_data, event_detail=event_detail
    )

@event_app.route("/<int:event_id>/timetable", methods=["GET"])
def timetable(event_id):
    logger.info("call: timetable")

    user_info = {
        'login': session.get('login', False),
        'name': session.get('name', ''),
    }

    event_detail = event.get_event_detail(event_id)
    timetable = event.get_timetable(event_id)

    header_data = {
        "event_name": event_detail['event_name'],
        "menu_item_list": [
            {
                "name": "event list",
                "url_path": "/",
            },
            {
                "name": "event detail",
                "url_path": "/{}".format(event_id),
            }
        ],
    }

    return render_template(
        "event/timetable.html", user_info=user_info, header_data=header_data, timetable=timetable
    )

def str_to_datetime(datetime_str):

    # return datetime.fromisoformat(datetime_str.replace('Z', '+00:00')) # python3.7~
    return datetime.strptime(datetime_str, '%Y-%m-%dT%H:%M:%S.%fZ') # not %z, because https://bugs.python.org/issue15873
