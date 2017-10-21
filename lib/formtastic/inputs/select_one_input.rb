module Formtastic
  module Inputs
    class SelectOneInput < SelectInput
      def input_options
        super.merge include_blank: false
      end

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
          template.content_tag( :div, opts ) do
            search_box <<
            select_html <<
            template.content_tag( :span, '', class: 'status' )
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
          'data-search': options[:search_param] ? options[:search_param] : 'name_contains',
          'data-text': options[:member_label] ? options[:member_label] : ( options[:text_key] ? options[:text_key] : 'name' ),
          'data-value': options[:value_key] ? options[:value_key] : 'id',
        }
        template.text_field_tag( nil, '', opts )
      end

      def select_html
        selected = options[:selected] ? options[:selected] : object.send( input_name )
        sel = ''
        collection.each do |item|
          if item[1] == selected
            sel = template.options_for_select( [item], selected ) if item[1] == selected
            break
          end
        end
        builder.select(input_name, sel, input_options, input_html_options.merge( 'data-select': 'src' ) )
      end
    end
  end
end
