# frozen_string_literal: true

module Formtastic
  module Inputs
    class SelectOneInput < SelectInput
      # def input_options
      #   super.merge include_blank: false
      # end

      def input_wrapping(&block)
        template.content_tag(options[:filter_form] ? :div : :li,
          [template.capture(&block), error_html, hint_html].join("\n").html_safe,
          wrapper_html_options
        )
      end

      def to_html
        opts = { class: 'select-one-inputs' }
        input_wrapping do
          label_html <<
          template.content_tag(:div, opts) do
            search_box <<
            select_html <<
            template.content_tag(:span, '', class: 'status')
          end
        end
      end

      def search_box
        # TODO: remove text_key in next major version
        opts = {
          id: nil,
          class: 'search-select',
          placeholder: options[:placeholder],
          'data-counter-limit': options[:counter_limit].to_i,
          'data-msg': options[:msg_items],
          'data-remote-collection': options[:remote_collection],
          'data-search': options[:search_param] || 'name_contains',
          'data-text': options[:member_label] || options[:text_key] || 'name',
          'data-value': options[:value_key] || 'id'
        }
        template.text_field_tag(nil, '', opts)
      end

      def select_html
        selected = options[:selected] || object.send(input_name)
        opts = input_html_options.merge('data-select': 'src')
        opts['data-include-blank'] = '1' if input_options[:include_blank]
        template.select_tag input_name, template.options_for_select(collection, selected), input_options.merge(opts)
      end
    end
  end
end
