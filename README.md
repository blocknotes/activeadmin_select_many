# ActiveAdmin Select Many [![Gem Version](https://badge.fury.io/rb/activeadmin_select_many.svg)](https://badge.fury.io/rb/activeadmin_select_many)

An Active Admin plugin which improves one-to-many and many-to-many associations selection (jQuery required).

Features:
- search box
- available items on the left, selected items on the right
- local/remote collections
- double click to add/remove items
- sortable (with up/down buttons)
- no dependecies other than jQuery

![screenshot](screenshot.png)

*(inspired by RailsAdmin associations selector)*

## Install

- Add to your Gemfile:
`gem 'activeadmin_select_many'`
- Execute bundle
- Add at the end of your ActiveAdmin styles (_app/assets/stylesheets/active_admin.scss_):
`@import 'activeadmin/select_many';`
- Add at the end of your ActiveAdmin javascripts (_app/assets/javascripts/active_admin.js_):
`//= require activeadmin/select_many`
- Use the input with `as: :select_many` in Active Admin model conf

## Examples

Add to ActiveAdmin model config, in *form* block.

- Local collection (no AJAX calls):
`f.input :sections, as: :select_many`
- Remote collection (using AJAX):
`f.input :tags, as: :select_many, remote_collection: admin_tags_path( format: :json )`
- Changing search param and text key (default: *name*):
`f.input :tags, as: :select_many, remote_collection: admin_tags_path( format: :json ), search_param: 'category_contains', text_key: 'category', placeholder: 'Type something...'`
- Sortable (items position must be saved manually):
`f.input :tags, as: :select_many, remote_collection: admin_tags_path( format: :json ), sortable: true`

Example to update *position* field:

```rb
  after_save :on_after_save
  controller do
    def on_after_save( object )
      if params[:article][:section_ids]
        order = {}
        params[:article][:section_ids].each_with_index { |id, i| order[id.to_i] = i }
        object.sections.each { |item| item.update_column( :position, order[item.id].to_i ) }
      end
    end
  end
```

Example to enable JSON response on an ActiveAdmin model:

```rb
ActiveAdmin.register Tag do
  config.per_page = 30  # to limit served items
  config.sort_order = 'name_asc'
  index download_links: [:json]
end
```

## Options

- **collection**: local collection
- **placeholder**: placeholder string for search box
- **remote_collection**: JSON path
- **search_param**: parameter to use as search key (ransack style)
- **sortable**: set to true to enable sortable buttons (default: not set)
- **size**: number of rows of both the selects (default: 4)
- **text_key**: key to use as text for select options

## Do you like it? Star it!

If you use this component just star it. A developer is more motivated to improve a project when there is some interest.

## Contributors

- [Mattia Roccoberton](http://blocknot.es) - creator, maintainer

## License

[MIT](LICENSE.txt)
