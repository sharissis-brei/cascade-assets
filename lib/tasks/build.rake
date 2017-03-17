require 'zip_file_generator'

namespace :build do
  namespace :omninav do
    #
    # Build static version: rake build:omninav:static
    #
    desc "Build static OmniNav navbar assets and markup."
    task deprecated_static: :environment do
      target = 'static'
      deploy_files = ['omni-nav.css',
                      'omni-nav.css.gz',
                      'omni-nav.js',
                      'omni-nav.js.gz',
                      'omninav.html']

      # Prep staging and output directories.
      puts format("\nBuilding OmniNav %s version.\n", target)
      staging_dir = Rails.root.join('build', 'omninav', 'staging')
      output_dir = Rails.root.join('build', 'omninav', 'static')
      [staging_dir, output_dir].each do |dir|
        FileUtils.rm_rf dir
        FileUtils.mkdir_p dir
      end

      # Build Asset files.
      Rails.application.config.assets.prefix = "../build/omninav/staging"
      Rails.application.config.assets.digest = false
      Rails.application.config.assets.paths = [Rails.root.join('/app/assets/javascripts'),
                                               Rails.root.join('/app/assets/stylesheets/omni_nav')]
      Rails.application.config.assets.precompile = ['omni-nav.js', 'omni-nav.css']
      Rake::Task['assets:clean'].invoke
      Rake::Task['assets:precompile'].invoke

      # Build HTML file.
      html_file = staging_dir.join 'omninav.html'
      builder = Omninav::Builder.new(target: target)
      omninav_html = builder.build

      # Write to file
      File.open(html_file, 'w') { |file| file.write(omninav_html) }

      # Move selected files from staging to output directory.
      deploy_files.each do |file|
        staging_file = staging_dir.join(file)
        deploy_file = output_dir.join(file)
        FileUtils.mv staging_file, deploy_file
        puts format('Writing %s.', deploy_file)
      end

      # Clean Up
      FileUtils.rm_rf staging_dir

      # Report
      puts format("\nBuild complete. Find files in %s.", output_dir)
    end

    #
    # Build static version: rake build:omninav:static
    #
    desc "Build static OmniNav navbar assets and markup."
    task deprecated_static: :environment do
      # Params
      target = 'static'

      # Prep Builder
      builder = Omninav::Builder.new(target: target)
      builder.prep_build
      builder.deploy_map = {
        'omni-nav-*.css' => 'omni-nav.min.css',
        'omni-nav-*.js' => 'omni-nav.min.js',
        'omni-nav-*.css.gz' => 'omni-nav.css.gz',
        'omni-nav-*.js.gz' => 'omni-nav.js.gz',
        'omni-nav.html' => 'omni-nav.html'
      }
      puts format("\nBuilding OmniNav %s version:%s\n", target, builder.build_version)

      # Why this? Setting Rails.env or ENV['RAILS_ENV'] didn't work.
      # See http://stackoverflow.com/a/1090319/6763239.
      system("rake build:omninav:assets RAILS_ENV=production")

      builder.generate_markup_file
      builder.move_output_files_to_build_directory
      builder.cleanup

      # Report
      puts format("\nBuild complete. Find files in %s.", builder.output_dir)
    end

    #
    # Build blogs version: rake build:omninav:blogs
    #
    # Blogs expects files here:
    # https://github.com/chapmanu/blogs/tree/development/content/plugins/cu-wp-customization/omni-nav
    #
    # Loaded at runtime here:
    # https://github.com/chapmanu/blogs/blob/development/content/plugins/cu-wp-customization/cu-wp-customization.php#L243
    #
    desc "Build OmniNav navbar assets and markup for Blogs site."
    task blogs: :environment do
      # Params
      target = 'blogs'

      # Prep Builder
      builder = Omninav::Builder.new(target: target)
      builder.prep_build
      puts format("\nBuilding OmniNav %s version:%s\n", target, builder.build_version)

      # Why this? Setting Rails.env or ENV['RAILS_ENV'] didn't work.
      # See http://stackoverflow.com/a/1090319/6763239.
      system("rake build:omninav:assets RAILS_ENV=production")

      builder.generate_markup_file
      builder.move_output_files_to_build_directory
      builder.cleanup

      # Report
      puts format("\nBuild complete. Find files in %s.", builder.output_dir)
    end

    desc "Build OmniNav navbar assets."
    task assets: :environment do
      # Configure the asset pipeline to compile minified files.
      # NOTE: Sprockets only minifies files in production environment so this assumes
      # RAILS_ENV is set to production on the command line.
      Rails.application.config.assets.prefix = "../build/omninav/staging"
      Rails.application.config.assets.paths = [Rails.root.join('app/assets/javascripts'),
                                               Rails.root.join('app/assets/stylesheets')]
      Rails.application.config.assets.precompile -= ['master.js', 'master.css']
      Rails.application.config.assets.precompile += ['omni-nav.js', 'omni-nav.css']

      # Let it rip.
      Rake::Task['assets:clobber'].invoke
      Rake::Task['assets:precompile'].invoke
    end
  end

  #
  # Build all versions: rake build:omninav
  #
  desc "Build OmniNav navbar assets and markup for various Chapman websites."
  task omninav: :environment do
    # FIXME: Fails after first build task is run. Whyyyy????
    Rake::Task['build:omninav:blogs'].invoke
    Rake::Task['build:omninav:static'].invoke
  end
end

desc "Build assets for deployment to Cascade."
task build: :environment do
  if Rails.env.development?
    puts "Please specify build environment"
    puts "Examples:"
    puts "  rake build RAILS_ENV=staging"
    puts "  rake build RAILS_ENV=production"
  else
    # FIXME
    # This is only needed here (AFAICT) and breaks things in test and elsewhere because it
    # overrides the behavior of render. For more info, see
    # http://stackoverflow.com/q/39396601/1093087.
    #
    # Bigger question: do we really need this gem just for this one call? Can't we leverage
    # something already in Rails?
    require 'render_anywhere'
    include RenderAnywhere

    prep_dist

    zip rails_asset_path, dist_assets_path
    File.write(dist_cascade_block_path, render(file: 'layouts/cascade-assets.xml', layout: false))
    FileUtils.cp instructions, dist_folder
  end
end

task build_omni_nav: :environment do
  if Rails.env.development?
    puts "Please specify build environment"
    puts "Examples:"
    puts "  rake build_omni_nav RAILS_ENV=staging"
    puts "  rake build_omni_nav RAILS_ENV=production"
  else
    prep_dist

    # Setup Rails asset paths for just omni-nav assets & compile them
    Rails.application.config.assets.paths = [File.join(Rails.root, "/app/assets/javascripts"),
                                             File.join(Rails.root, "/app/assets/stylesheets")]
    Rails.application.config.assets.precompile -= ['master.js', 'master.css']
    Rails.application.config.assets.precompile += ['omni-nav.js', 'omni-nav.css']

    Rake::Task['assets:precompile'].invoke

    zip rails_asset_path, dist_assets_path
    puts "Assets saved to public/_assets"
  end
end

task do_precompile: :environment do
  Rake::Task['assets:clobber'].invoke
  Rake::Task['assets:precompile'].invoke
end

####################
# HELPER FUNCTIONS #
####################

def prep_dist
  FileUtils.mkdir('dist') unless File.directory?('dist')
  FileUtils.rm_rf dist_folder
  FileUtils.mkdir dist_folder
end

def rails_asset_path
  Rails.root.join('public', '_assets')
end

def dist_folder
  Rails.root.join('dist', Rails.env)
end

def dist_assets_path
  Rails.root.join('dist', Rails.env, '_assets.zip')
end

def dist_cascade_block_path
  Rails.root.join('dist', Rails.env, 'cascade-assets.xml')
end

def instructions
  Rails.root.join('lib', 'instructions.txt')
end

def zip(input_folder, output_name)
  zf = ZipFileGenerator.new(input_folder, output_name)
  zf.write
end
