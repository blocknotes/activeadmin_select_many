module Formtastic
  module Inputs
    class SelectOneInput < SelectInput
      def input_options
        super.merge include_blank: false
      end

      # def input_html_options
      #   super.merge( class: 'select-one' )
      # end

      def to_html
        opts = { class: 'select-one-inputs' }
        input_wrapping do
          label_html <<
          template.content_tag( :div, opts ) do
            search_box <<
            select_html <<
            template.content_tag( :span, '' ) <<
            template.content_tag( :span, template.t( 'inputs.select_one.status' ), class: 'status' )
          end
        end
      end

      # def hidden_input
      #   template.content_tag( :div, class: 'values', 'data-name': input_html_options[:name] ) do
      #     values = object.send( input_name )
      #     values = [values] if values.is_a? Fixnum
      #     values.each do |value|
      #       template.concat template.hidden_field_tag( input_html_options[:name], value, {id: nil} )
      #     end if values
      #   end
      # end

      def search_box
        @opts ||= {id: nil, class: 'search-select', placeholder: options[:placeholder], 'data-remote-collection': options[:remote_collection], 'data-search': options[:search_param] ? options[:search_param] : 'name_contains', 'data-text': options[:text_key] ? options[:text_key] : 'name', 'data-value': options[:value_key] ? options[:value_key] : 'id', 'data-msg': options[:msg_items]}
        template.text_field_tag( nil, '', @opts )
      end

      # def select_src_html
      #   coll = if options[:remote_collection]
      #     []
      #   else
      #     # TODO: add option unique ?
      #     selected = object.send( input_name )
      #     selected = [selected] if selected.is_a? Fixnum
      #     selected ? collection.select { |option| !selected.include?( option[1] ) } : collection
      #   end
      #   opts = input_options.dup.merge( name: nil, id: nil, multiple: true, 'data-select': 'src' )
      #   template.select_tag nil, template.options_for_select( coll ), opts
      # end


      # def select_dst_html
      #   selected = object.send( input_name )
      #   selected = [selected] if selected.is_a? Fixnum
      #   coll = selected ? collection.select { |option| selected.include?( option[1] ) } : collection
      #   opts = input_options.dup.merge( name: nil, id: nil, multiple: true, 'data-select': 'dst' )
      #   template.select_tag nil, template.options_for_select( coll ), opts
      # end

      # # def select_html
      # #   selected = object.send( input_name )
      # #   coll = collection.select { |option| selected.include?( option[1] ) }

      # #   opts = input_options.dup.merge( name: nil, id: nil, multiple: true )
      # #   template.select_tag nil, template.options_for_select( coll ), opts

      # #   # builder.select(input_name, coll, input_options, input_html_options)
      # # end

      def select_html
        selected = object.send( input_name )
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
