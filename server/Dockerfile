# Use a Ruby runtime as base image
FROM ruby:latest

# Set the working directory in the container
WORKDIR /app

# Copy the Gemfile and Gemfile.lock into the container
COPY Gemfile Gemfile.lock ./

# Install dependencies using Bundler
RUN bundle install

# Copy the application code into the container
COPY . .

# Command to run your Sinatra application
CMD ["ruby", "app.rb"]
