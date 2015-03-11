require 'bundler/setup'
require 'jekyll'
require 'tmpdir'
require 'launchy'
require 'zip'

#################
# ::: TASKS ::: #
#################

GITHUB_REPONAME = 'cascade-assets'

desc "Serve the site locally for development"
task :serve do
  exec("foreman start")
end

desc "Launch a web browser on the port"
task :launch do
  Launchy.open("http://localhost:5000")
end

namespace :generate do
  desc "Create the production version of the assets"
  task :production do
    generate destination: 'dist_production', config: ['_config.yml' , '_production_server_config.yml'] 
  end

  desc "Create the production version of the assets"
  task :development do
    generate destination: 'dist_development', config: ['_config.yml' , '_development_server_config.yml'] 
  end
end

desc "Publish this local version of the site to github pages"
task :publish => [:generate] do
  puts "Publishing local version to http://chapmanu.github.io/#{GITHUB_REPONAME}"
  Dir.mktmpdir do |tmp|
    FileUtils.cp_r "_site/.", tmp

    pwd = Dir.pwd
    Dir.chdir tmp

    cmd "git init"
    cmd "git add ."
    message = "Site updated at #{Time.now.utc}"
    cmd "git commit -m  #{message.inspect}"
    cmd "git remote add origin git@github.com:#{GITHUB_REPONAME}.git"
    cmd "git push origin master:refs/heads/gh-pages --force"

    Dir.chdir pwd
  end
  puts "Publish successful"
end


############################
# ::: HELPER FUNCTIONS ::: #
############################

def rm_all_except(file, directory)
  Dir["#{directory}/*"].each{|f| FileUtils.rm(f) unless f =~ /#{file}/}
end

def zip(input_folder, output_name)
  Zip::File.open(output_name, Zip::File::CREATE) do |zipfile|
      Dir[File.join(input_folder, '**', '**')].each do |file|
        zipfile.add(file.sub(input_folder, ''), file)
      end
  end
end

def build_site(destination, config)
  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => destination,
    "config"      => config
  })).process
end

def generate(options={})
  destination = options[:destination]
  config      = options[:config]
  build_site(destination, config)
  rm_all_except('_assets', destination)
  zip("#{destination}/_assets", "#{destination}/_assets.zip")
end
