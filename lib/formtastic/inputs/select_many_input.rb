# frozen_string_literal: true

module Formtastic
  module Inputs
    class SelectManyInput < SelectInput
      def to_html
        options[:'data-remote-collection'] = options.delete(:remote_collection)
        opts = { class: 'select-many-inputs' }
        opts[:sortable] = options.delete(:sortable) if options[:sortable]
        input_wrapping do
          label_html <<
          template.content_tag(:div, opts) do
            hidden_input <<
            search_box_html <<
            template.content_tag(:span, '', class: 'empty') <<
            template.content_tag(:span, ::I18n.t('inputs.select_many.available'), class: 'available') <<
            template.content_tag(:span, ::I18n.t('inputs.select_many.selected'), class: 'selected') <<
            select_src_html <<
            buttons_html <<
            select_dst_html
          end
        end
      end

      def hidden_input
        template.content_tag(:div, class: 'values', 'data-name': input_html_options[:name]) do
          values = object.send(input_name)
          values = [values] if values.is_a? Integer
          values.each do |value|
            template.concat template.hidden_field_tag(input_html_options[:name], value, {id: nil})
          end if values
        end
      end

      def buttons_html
        template.content_tag(:div, class: 'buttons') do
          template.link_to('&rarr;'.html_safe, 'Javascript:void(0)', class: 'add') +
          template.link_to('&larr;'.html_safe, 'Javascript:void(0)', class: 'remove') +
          template.link_to('&uarr;'.html_safe, 'Javascript:void(0)', class: 'move_up') +
          template.link_to('&darr;'.html_safe, 'Javascript:void(0)', class: 'move_down')
        end
      end

      def search_box_html
        opts = {
          id: nil,
          class: 'search-select',
          placeholder: options.delete(:placeholder),
          'data-counter-limit': options[:counter_limit].to_i,
          'data-remote-collection': options[:'data-remote-collection'],
          'data-search': options[:search_param] ? options[:search_param] : 'name_contains',
          'data-text': options[:member_label] ? options[:member_label] : (options[:text_key] ? options[:text_key] : 'name'),
          'data-value': options[:value_key] ? options[:value_key] : 'id',
        }
        template.text_field_tag(nil, '', opts)
      end

      def select_src_html
        coll =
          if options[:'data-remote-collection']
            []
          else
            # TODO: add option unique ?
            selected = object.send(input_name)
            selected = [selected] if selected.is_a? Integer
            selected ? collection.select { |option| !selected.include?(option[1]) } : collection
          end
        opts = {
          id: nil,
          include_blank: false,
          multiple: true,
          name: nil,
          size: options[:size] || 4,
          'data-select': 'src'
        }
        template.select_tag 'select_src', template.options_for_select(coll), input_options.merge(opts)
      end

      def select_dst_html
        selected = options[:selected] || object.send(input_name)
        selected = [selected] if selected.is_a? Integer
        coll = selected ? collection.select { |option| selected.include?(option[1]) } : []
        opts = {
          id: nil,
          include_blank: false,
          multiple: true,
          name: nil,
          size: options[:size] || 4,
          'data-select': 'dst'
        }
        template.select_tag 'select_dst', template.options_for_select(coll), input_options.merge(opts)
      end
    end
  end
end
