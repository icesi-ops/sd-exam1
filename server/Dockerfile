# Use a Ruby runtime as base image
FROM ruby:2.7.6-alpine

# Set the working directory in the container
WORKDIR /app

RUN apk add --no-cache build-base linux-headers ruby-dev

# Copy the Gemfile and Gemfile.lock into the container
COPY Gemfile Gemfile.lock ./

# Install dependencies using Bundler
RUN bundle install

# Copy the application code into the container
COPY . .

EXPOSE 4567

# Command to run your Sinatra application
CMD ["ruby", "-r", "sinatra", "app.rb", "-p", "4567"]

