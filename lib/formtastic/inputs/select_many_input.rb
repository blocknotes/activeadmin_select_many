module Formtastic
  module Inputs
    class SelectManyInput < SelectInput
      # def input_html_options
      #   super.merge( class: 'select-many' )
      # end

      def to_html
        input_wrapping do
          label_html <<
          hidden_input <<
          template.content_tag( :div, class: 'selects' ) do
            search_box +
            template.content_tag( :span, '' ) +
            template.content_tag( :span, template.t( 'inputs.select_many.available' ) + ':' ) +
            template.content_tag( :span, template.t( 'inputs.select_many.selected'  ) + ':' ) +
            select_src_html +
            select_dst_html
          end
        end
      end

      def hidden_input
        template.content_tag( :div, class: 'values', 'data-name': input_html_options[:name] ) do
          object.send( input_name ).each do |value|
            template.concat template.hidden_field_tag( input_html_options[:name], value, {id: nil} )
          end
        end
      end

      def search_box
        @opts ||= {id: nil, class: 'search-select', placeholder: options[:placeholder], 'data-remote': options[:remote_collection], 'data-search': options[:search_param] ? options[:search_param] : 'name_contains', 'data-text': options[:text_key] ? options[:text_key] : 'name', 'data-value': options[:value_key] ? options[:value_key] : 'id'}
        template.text_field_tag( nil, '', @opts )
      end

      def select_src_html
        coll = if options[:remote_collection]
          []
        else
          # TODO: add option unique ?
          selected = object.send( input_name )
          collection.select { |option| !selected.include?( option[1] ) }
        end
        opts = input_options.dup.merge( name: nil, id: nil, multiple: true, 'data-select': 'src' )
        template.select_tag nil, template.options_for_select( coll ), opts
      end

      def select_dst_html
        selected = object.send( input_name )
        coll = collection.select { |option| selected.include?( option[1] ) }
        opts = input_options.dup.merge( name: nil, id: nil, multiple: true, 'data-select': 'dst' )
        template.select_tag nil, template.options_for_select( coll ), opts
      end

      # def select_html
      #   selected = object.send( input_name )
      #   coll = collection.select { |option| selected.include?( option[1] ) }

      #   opts = input_options.dup.merge( name: nil, id: nil, multiple: true )
      #   template.select_tag nil, template.options_for_select( coll ), opts

      #   # builder.select(input_name, coll, input_options, input_html_options)
      # end
    end
  end
end
