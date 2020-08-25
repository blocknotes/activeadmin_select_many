# frozen_string_literal: true

RSpec.describe 'Select one', type: :system do # rubocop:disable Metrics/BlockLength
  let(:authors) do
    3.times.map do |i|
      Author.create!(email: "some_email_#{i}@example.com", name: "John #{i}", age: 30 + i * 3)
    end
  end
  let(:post) { Post.create!(title: 'Test', author: authors.first) }

  before do
    post
  end

  after do
    post.destroy
    authors.each(&:destroy)
  end

  context 'with a select_one input' do
    let(:search_select) { '#post_author_input .search-select' }

    it 'includes the text search field and the input select' do
      visit "/admin/posts/#{post.id}/edit"

      expect(page).to have_css(search_select)
      expect(page).to have_select('post[author_id]', selected: authors.first.name)
    end

    it 'updates the entity association' do
      visit "/admin/posts/#{post.id}/edit"

      author_name = authors.last.name
      find_field('post[author_id]').select(author_name)
      find('[type="submit"]').click
      expect(page).to have_content('was successfully updated')
      expect(post.reload.author.name).to eq(author_name)
    end
  end
end
