FROM ruby:2.2.2

ADD ["Gemfile", "Gemfile.lock", "/build/"]

# throw errors if Gemfile has been modified since Gemfile.lock
WORKDIR /build
RUN bundle config --global frozen 1 && bundle install

RUN apt-get update && apt-get install -y rsync

ADD .deploy.on.docker.sh /deploy.sh
RUN chmod +x /deploy.sh
CMD ["/deploy.sh"]
