# Unfortunately, jekyll-assets sometimes does not generate images properly unless
# a liquid tag in the html is present.  So I am going to read all the images in the
# _assets/images folder and inject them into the html.


hack_file = File.open('images.html', 'w')

hack_file.puts "---"
hack_file.puts "layout: cascade"
hack_file.puts "---"

Dir.glob("_assets/images/**/*.*").each do |image_path| # looks like "_assets/images/gray_arrow.png"
  relative_path = image_path.gsub('_assets/images/', '')
  hack_file.puts "{% image #{relative_path} %}"
end

hack_file.close