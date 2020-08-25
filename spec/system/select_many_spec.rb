# frozen_string_literal: true

RSpec.describe 'Select many', type: :system do # rubocop:disable Metrics/BlockLength
  let(:author) { Author.create!(email: 'some_email@example.com', name: 'John Doe', age: 30) }
  let(:post) { Post.create!(title: 'Test', author: author) }
  let(:tags) do
    3.times.map do |i|
      Tag.create!(name: "A tag #{i}")
    end
  end

  before do
    post.tags << tags.last
  end

  after do
    post.destroy
    author.destroy
    tags.each(&:destroy)
  end

  context 'with a select_many input' do
    let(:source_select) { '#post_tags_input select[data-select="src"]' }
    let(:destination_select) { '#post_tags_input select[data-select="dst"]' }

    it 'includes the input selects' do
      visit "/admin/posts/#{post.id}/edit"

      expect(page).to have_css(source_select)
      expect(page).to have_css(destination_select)
      src_options = find_all("#{source_select} option").map(&:text)
      expect(src_options).to match_array(Tag.pluck(:name) - post.tags.pluck(:name))
      dst_option = find("#{destination_select} option", match: :first)
      expect([dst_option.value, dst_option.text]).to eq [post.tags.first.id.to_s, post.tags.first.name]
    end

    it 'updates the entity association' do
      visit "/admin/posts/#{post.id}/edit"

      find(destination_select).click
      find("#{destination_select} option", match: :first).double_click
      expect(find_all("#{destination_select} option")).to be_empty
      find(source_select).click
      first_option = find("#{source_select} option", match: :first)
      text = first_option.text
      first_option.double_click
      expect(find_all("#{destination_select} option").map(&:text)).to eq [text]

      find('[type="submit"]').click
      expect(page).to have_content('was successfully updated')
      expect(post.reload.tags.pluck(:name)).to eq [text]
    end
  end
end
