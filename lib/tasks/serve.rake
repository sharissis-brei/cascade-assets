desc "Runs forman start"
task serve: :environment do
  system('bundle exec foreman start')
end

# Alias
task server: :environment do
  Rake::Task["serve"].invoke
end
