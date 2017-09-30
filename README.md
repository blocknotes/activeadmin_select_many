# ActiveAdmin Select Many [![Gem Version](https://badge.fury.io/rb/activeadmin_select_many.svg)](https://badge.fury.io/rb/activeadmin_select_many)

An Active Admin plugin which improves one-to-many / many-to-many / many-to-one associations selection using 2 new inputs: **select_many** and **select_one** (jQuery required)

Features for *select_many*:
- search box
- available items on the left, selected items on the right
- local/remote collections
- double click to add/remove items
- sortable (with up/down buttons)

Features for *select_one*:
- search box
- selected items on the right
- remote collections
- counter of items found
- can be used as filter

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

## Options

- **collection**: local collection
- **filter_form**: for *select_one* only, allow to use it as filter
- **placeholder**: placeholder string for search box
- **remote_collection**: JSON path
- **search_param**: parameter to use as search key (ransack format)
- **sortable**: set to true to enable sortable buttons (default: not set)
- **size**: number of rows of both the selects (default: 4)
- **text_key**: key to use as text for select options

## Example with select_many

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

## Example with select_one

In a form:

`f.input :article, as: :select_one, placeholder: 'Search...', remote_collection: admin_articles_path( format: :json ), search_param: 'title_contains', text_key: 'title'`

As filter:

`filter :article_id_eq, as: :select_one, filter_form: true, placeholder: 'Search...', search_param: 'title_contains', text_key: 'title', remote_collection: '/admin/articles.json'`

## Do you like it? Star it!

If you use this component just star it. A developer is more motivated to improve a project when there is some interest.

Take a look at [other ActiveAdmin components](https://github.com/blocknotes?utf8=✓&tab=repositories&q=activeadmin&type=source) that I made if you are curious.

## Contributors

- [Mattia Roccoberton](http://blocknot.es) - creator, maintainer

## License

[MIT](LICENSE.txt)
