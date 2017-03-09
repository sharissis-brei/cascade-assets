#
# OmniNav is the navbar that is used across multiple Chapman websites to provide a consistent,
# unified experience. The markup and assets need to be integrated in multiple independent
# projects, like Inside and Blogs.
#
# This class is used by the rake build task to build omninav for each of the projects that
# require it. It consolidates OmniNav development and updates in this one module.
#
module Omninav
    class Builder
        def self.build()
            builder = Omninav::Builder.new
            output_file = Rails.root.join(builder.output_dir, 'omninav-test.html')

            File.open(output_file, 'w') { |file| file.write('Success.') }

            builder
        end

        def initialize
        end

        def output_dir
            dir_path = Rails.root.join('dist', Rails.env)
            FileUtils::mkdir_p dir_path unless File.exists?(dir_path)
            dir_path
        end

        private
    end
end