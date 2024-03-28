print "Enter your name: "
name = gets.chomp
puts "Hello, #{name}!"


# docker run -it -v "/Users/rayanslim/Desktop/docker-bootcamp-resources/ruby-user-input/script.rb:/app/script.rb" ruby:3.0 ruby /app/script.rb