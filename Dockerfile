FROM ruby:2.4.2-alpine3.7
ENV LANG C.UTF-8
ENV APP_HOME /kevd

RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD Gemfile* $APP_HOME/

RUN apk update && \
    apk add --no-cache \
      build-base ruby-dev libressl-dev libc-dev \
      linux-headers mariadb-dev yarn && \
    gem install --no-ri --no-rdoc bundler && \
    bundle install && \
    apk del --purge linux-headers build-base libc-dev libressl-dev ruby-dev && \
    rm -rf /var/cache/apk/*

ADD . $APP_HOME

EXPOSE 3000

ENTRYPOINT ["sh", "./script/web_entrypoint.sh"]
