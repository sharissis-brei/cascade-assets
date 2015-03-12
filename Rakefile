require 'bundler/setup'
require 'jekyll'
require 'tmpdir'
require './lib/zip_file_generator.rb'

#################
# ::: TASKS ::: #
#################

GITHUB_REPONAME = 'cascade-assets'

desc "Serve the site locally for development"
task :serve do
  exec("foreman start")
end

task :build do
  puts "Please specify build target."
  puts "Examples:"
  puts "  rake build:production"
  puts "  rake build:staging"
end

namespace :build do
  desc "Create the production version of the assets"
  task :production do
    generate destination: 'dist/production', config: ['_config.yml' , '_config.production.yml'] 
  end

  desc "Create the production version of the assets"
  task :staging do
    generate destination: 'dist/staging', config: ['_config.yml' , '_config.staging.yml'] 
  end
end

############################
# ::: HELPER FUNCTIONS ::: #
############################

def rm_all_except(files, directory)
  unwanted_files = Dir.glob("#{directory}/*").reject do |file|
    files.any?{|f| "#{directory}/#{f}" == file}
  end
  unwanted_files.each do |file|
    FileUtils.rm file
  end
end

def zip(input_folder, output_name)
  zf = ZipFileGenerator.new(input_folder, output_name)
  zf.write()
end

def build_site(destination, config)
  Jekyll::Site.new(Jekyll.configuration({
    "destination" => destination,
    "config"      => config,
    "quiet"      => true
  })).process
end

def generate(options={})
  destination = options[:destination]
  config      = options[:config]

  puts "::: Build Started \xF0\x9F\x94\xA8".yellow

  build_site(destination, config)
  rm_all_except(['_assets', '_assets.zip', 'block.xml', 'instructions.txt'], destination)
  zip("#{destination}/_assets", "#{destination}/_assets.zip")

  print "    Assets built                ", "✔ #{destination}/_assets\n".green
  print "    Assets zipped               ", "✔ #{destination}/_assets.zip\n".green
  print "    New cascade block           ", "✔ #{destination}/block.xml\n".green
  print "    Deployment instructions     ", "✔ #{destination}/instructions.txt\n".green
  
  puts  "::: Build Succeeded \xF0\x9F\x8F\xA1".green.bold
end
