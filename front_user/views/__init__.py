#   Copyright 2022 NEC Corporation
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

NO_DATA_STR = " [x] Couldn't get data. "

def str_to_datetime(datetime_str):

    # return datetime.fromisoformat(datetime_str.replace('Z', '+00:00')) # python3.7~
    return datetime.strptime(datetime_str, '%Y-%m-%dT%H:%M:%S.%fZ') # not %z, because https://bugs.python.org/issue15873
