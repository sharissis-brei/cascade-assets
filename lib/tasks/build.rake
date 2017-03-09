require 'zip_file_generator'

namespace :build do
  namespace :omninav do
    desc "Build OmniNav navbar assets for various Chapman websites."
    task test: :environment do
      # generate_omninav_assets
      # generate_omninav_markup
      # Source: http://stackoverflow.com/a/18266486/6763239
      controller = ApplicationController.new
      controller.request = ActionDispatch::TestRequest.new
      renderer = ActionView::Base.new(Rails.root.join('app', 'views'), {}, controller)
      omninav_partial = 'widgets/shared/omninav'
      result = renderer.render(partial: omninav_partial, locals: {})
      puts result

      # Build

      builder = Omninav::Builder.build
      puts format('Output to %s', builder.output_dir)
    end
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

def generate_omninav_markup

end

