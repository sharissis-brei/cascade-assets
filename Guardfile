interactor :off

# guard 'livereload' do
#   watch(%r{docs/_site/.*})
# end

guard :shell do
  watch(%r{src/*}) do 
    puts "Styles changed"
    `touch docs/index.html`
  end
end