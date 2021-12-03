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
from flask import Blueprint, render_template, request
from logging import getLogger
from operator import attrgetter

from models import event

event_app = Blueprint("event", __name__, template_folder="templates")
logger = getLogger(__name__)

@event_app.route("/", methods=("GET"))
def eventList():
    logger.info("call: event")

    events = event.getEvents()

    upcomings = [x for x in events if x.event_date > datetime.now(globals.TZ)]
    upcomings.sort(key=attrgetter('event_date'), reverse=True)

    archives = [x for x in events if x.event_date <= datetime.now(globals.TZ)]
    archives.sort(key=attrgetter('event_date'), reverse=True)

    return render_template(
        "event/event.html", upcomings=upcomings, archives=archives
    )

@event_app.route("/<int:event_id>", methods=("GET"))
def eventDetail(event_id):
    logger.info("call: eventDetail [event_id={}]" % (event_id))

    return ""
