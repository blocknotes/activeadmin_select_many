require 'active_admin'

module ActiveAdmin
  module SelectMany
    class Engine < ::Rails::Engine
      engine_name 'activeadmin_select_many'

      # config.before_initialize do
      #   config.i18n.load_path += Dir["#{config.root}/config/locales/**/*.yml"]
      # end
    end
  end
end
