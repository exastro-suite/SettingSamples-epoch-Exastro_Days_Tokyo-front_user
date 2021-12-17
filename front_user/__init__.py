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
from json import load
from flask import Flask
from logging.config import dictConfig


def create_app(test_config=None):
    # Logging 設定ファイル読み込み
    with open("logging.json", "r", encoding="utf-8") as f:
        dictConfig(load(f))

    app = Flask(__name__, instance_relative_config=True)

    # 標準設定ファイル読み込み
    app.config.from_object("settings")

    # 非公開設定ファイル読み込み
    app.config.from_pyfile(os.path.join("config", "environment_setting.py"), silent=True)

    if test_config is not None:
        # テスト用設定を上書き
        app.config.from_mapping(test_config)

    from .views.event import event_app
    from .views.seminar import seminar_app
    from .views.user_login import user_login_app

    app.register_blueprint(event_app, url_prefix="/")
    app.register_blueprint(seminar_app, url_prefix="/seminar")
    app.register_blueprint(user_login_app, url_prefix="/login")

    return app
