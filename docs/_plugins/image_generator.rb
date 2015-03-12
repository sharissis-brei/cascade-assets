# Unfortunately, jekyll-assets sometimes does not generate images properly unless
# a liquid tag in the html is present.  So I am going to read all the images in the
# src/images folder and inject them into the html.


hack_file = File.open('docs/images.html', 'w')

hack_file.puts "---"
hack_file.puts "layout: docs"
hack_file.puts "---"

Dir.glob("src/images/**/*.*").each do |image_path| # looks like "src/images/gray_arrow.png"
  relative_path = image_path.gsub('src/images/', '')
  hack_file.puts "{% image #{relative_path} %}"
end

hack_file.close