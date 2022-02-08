FROM    ubuntu:18.04

RUN echo "RUN START" \
&&  apt-get -y update  \
&&  apt-get -y upgrade \
&&  apt-get -y install \
    locales \
    curl \
    python3-distutils \
    vim \
&&  curl https://bootstrap.pypa.io/pip/3.6/get-pip.py -o get-pip.py \
&&  python3 get-pip.py \
&&  python3 -m pip install -U pip \
&&  python3 -m pip install requests \
&&  python3 -m pip install Flask \
&&  python3 -m pip install Flask-Session \
&&  python3 -m pip install pytz \
&&  python3 -m pip install markdown \
&&  python3 -m pip install google-auth \
&&  python3 -m pip install redis \
&&  echo "RUN FINISH"

WORKDIR /app

COPY ./ /app/

ENV FLASK_APP=front_user
CMD ["flask", "run", "-h", "0.0.0.0","--with-threads"]
