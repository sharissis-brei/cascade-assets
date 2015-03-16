require 'bundler/setup'
require 'jekyll'
require 'tmpdir'
require 'launchy'

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

desc "Generate the website with jekyll"
task :generate do
  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => "_site"
  })).process
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