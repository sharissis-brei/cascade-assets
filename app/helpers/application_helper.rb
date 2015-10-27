module ApplicationHelper
  def title(text)
    content_for(:title, text)
  end

  def theme(text)
    content_for(:theme, text)
  end

  def widgets(yml)
    page = YAML.load(yml)
    page.each do |area, widgets|
      content_for(area.to_sym, render_widgets(*widgets))
    end
  end

  def render_widgets(*widgets)
    widgets.map {|widget|  render "widgets/#{widget}" }.join.html_safe
  end
end