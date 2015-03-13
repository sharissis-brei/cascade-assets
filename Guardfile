interactor :off

guard 'livereload', grace_period: 2.2 do
  watch(%r{docs/_site/.*})
end

guard :shell do
  watch(%r{src/*}) do 
    `touch docs/index.html`
  end
end