lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'activeadmin/select_many/version'

Gem::Specification.new do |spec|
  spec.name          = 'activeadmin_select_many'
  spec.version       = ActiveAdmin::SelectMany::VERSION
  spec.summary       = 'SelectMany plugin for ActiveAdmin'
  spec.description   = 'An Active Admin plugin which improves one-to-many and many-to-many associations selection (jQuery required)'
  spec.license       = 'MIT'
  spec.authors       = ['Mattia Roccoberton']
  spec.email         = 'mat@blocknot.es'
  spec.homepage      = 'https://github.com/blocknotes/activeadmin_select_many'

  spec.files         = Dir['{app,config,lib}/**/*', 'LICENSE.txt', 'Rakefile', 'README.md']
  spec.require_paths = ['lib']

  spec.add_runtime_dependency 'activeadmin', '~> 2.0'
  spec.add_runtime_dependency 'sassc', '~> 2.4'
end
