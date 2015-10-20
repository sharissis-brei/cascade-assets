interactor :off

guard :shell do
  watch(%r{src/*}) do
    puts "Styles changed"
    `touch docs/index.html`
  end
end