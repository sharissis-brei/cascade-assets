class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  protected

  def cascade_block(block_path)
    render_to_string(partial: block_path)
  end

  def cascade_format(format_path)
    # Make data definition a local within partial as variable current_page
    render_to_string(partial: format_path, locals: {current_page: @data_definition})
  end

  def render_velocity(format_path, data)
    # TODO: figure out how to stub this. Do we try to make an external call to a Velocity
    # renderer that parses the format path? Or maybe just make the format path file a Rails
    # module with a structure that parallels the format file in Cascade.
    format('TODO: render %s somehow with data %s', format_path, data)
  end

  def render_static_partial(view_path)
    # This can be used as a workaround until cascade formatting issue is resolved.
    render_to_string(partial: view_path)
  end

  def render_region_tags
    return unless @configuration_set
    @configuration_set.regions.each do |name, html|
      region_tag = format('<system-region name="%s"/>', name)
      response.body = response.body.gsub(region_tag, html)
    end
  end

  # rubocop:disable Metrics/AbcSize
  def render_system_page_meta_tags
    # Most tags have format system-page-meta-foo, but title tag is just: system-page-title
    title_tag = '<system-page-title/>'
    response.body = response.body.gsub(title_tag, @metadata_set.title)

    # Replace <system-page-meta-foo/> tags.
    return unless @metadata_set
    @metadata_set.class.column_names.each do |name|
      meta_tag = format('<system-page-meta-%s/>', name)
      content = @metadata_set.send(name)
      html = content.nil? ? '' : format('<meta name="%s" content="%s"/>', name, content)
      response.body = response.body.gsub(meta_tag, html)
    end
  end
  # rubocop:enable Metrics/AbcSize

  def build_assets_on_fly
    # It's not pretty but it works. I think.
    # See http://stackoverflow.com/a/9943895/6763239
    require 'rake'
    Rake::Task.clear # necessary to avoid tasks being loaded several times in dev mode
    CascadeAssetsRails::Application.load_tasks

    # This is what the Build :do_precompile task does.
    Rake::Task['assets:clobber'].invoke
    Rake::Task['assets:precompile'].invoke
  end

  def link_static_assets
    # Copies files from static to public directory. For templates not using assets bundle like
    # Law template.
    source = Rails.root.join('static', '_files')
    target = Rails.root.join('public')
    FileUtils.cp_r(source, target)
  end
end
