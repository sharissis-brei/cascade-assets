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

  def footer(theme)
    path = theme == "law" ? "law_footer" : "footer"
    content_for :footer do
      render "_cascade/blocks/html/#{path}"
    end
  end

  def render_widgets(*widgets)
    safe_join(widgets.map { |widget| render "widgets/#{widget}" })
  end
end
