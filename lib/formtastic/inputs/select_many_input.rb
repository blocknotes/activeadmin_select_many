module Formtastic
  module Inputs
    class SelectManyInput < SelectInput
      def to_html
        options[:'data-remote-collection'] = options.delete( :remote_collection )
        opts = { class: 'select-many-inputs' }
        opts[:sortable] = options.delete( :sortable ) if options[:sortable]
        input_wrapping do
          label_html <<
          template.content_tag( :div, opts ) do
            hidden_input <<
            search_box_html <<
            template.content_tag( :span, '', class: 'empty'  ) <<
            template.content_tag( :span, template.t( 'inputs.select_many.available' ), class: 'available' ) <<
            template.content_tag( :span, template.t( 'inputs.select_many.selected'  ), class: 'selected' ) <<
            select_src_html <<
            buttons_html <<
            select_dst_html
          end
        end
      end

      def hidden_input
        template.content_tag( :div, class: 'values', 'data-name': input_html_options[:name] ) do
          values = object.send( input_name )
          values = [values] if values.is_a? Fixnum
          values.each do |value|
            template.concat template.hidden_field_tag( input_html_options[:name], value, {id: nil} )
          end if values
        end
      end

      def buttons_html
        template.content_tag( :div, class: 'buttons' ) do
          template.link_to( '&rarr;'.html_safe, 'Javascript:void(0)', class: 'add' ) +
          template.link_to( '&larr;'.html_safe, 'Javascript:void(0)', class: 'remove' ) +
          template.link_to( '&uarr;'.html_safe, 'Javascript:void(0)', class: 'move_up' ) +
          template.link_to( '&darr;'.html_safe, 'Javascript:void(0)', class: 'move_down' )
        end
      end

      def search_box_html
        @opts ||= {id: nil, class: 'search-select', placeholder: options.delete( :placeholder ), 'data-remote-collection': options[:'data-remote-collection'], 'data-search': options[:search_param] ? options[:search_param] : 'name_contains', 'data-text': options[:text_key] ? options[:text_key] : 'name', 'data-value': options[:value_key] ? options[:value_key] : 'id'}
        template.text_field_tag( nil, '', @opts )
      end

      def select_src_html
        coll = if options[:'data-remote-collection']
          []
        else
          # TODO: add option unique ?
          selected = object.send( input_name )
          selected = [selected] if selected.is_a? Fixnum
          selected ? collection.select { |option| !selected.include?( option[1] ) } : collection
        end
        opts = input_options.merge( name: nil, id: nil, multiple: true, 'data-select': 'src', size: options[:size] ? options[:size] : 4 )
        template.select_tag nil, template.options_for_select( coll ), opts
      end

      def select_dst_html
        selected = object.send( input_name )
        selected = [selected] if selected.is_a? Fixnum
        coll = selected ? collection.select { |option| selected.include?( option[1] ) } : collection
        opts = input_options.merge( name: nil, id: nil, multiple: true, 'data-select': 'dst', size: options[:size] ? options[:size] : 4 )
        template.select_tag nil, template.options_for_select( coll ), opts
      end
    end
  end
end
