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
        #
        # Class Methods
        #

        #
        # Instance Methods
        #
        def initialize
        end

        def build
            # TODO: Format using named parameters.
            # See http://stackoverflow.com/questions/196841
            format(navbar_template)
        end

        private

        #
        # Markup Methods
        #
        # Note: when updating navbar markup, you will most likely be changing one of these
        # methods.
        #
        def navbar_template
            <<-NAVBAR

<!-- OmniNav NavBar -->
<div id="cu_nav" class="use-transitions">
</div>
<!-- End OmniNav NavBar -->

NAVBAR
        end
    end
end