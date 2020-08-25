# frozen_string_literal: true

ActiveAdmin.register Post do
  permit_params :author_id, :title, :description, :category, tag_ids: []

  form do |f|
    f.inputs do
      f.input :author, as: :select_one
      f.input :title
      f.input :description
      f.input :category
      f.input :tags, as: :select_many
    end
    f.actions
  end
end
