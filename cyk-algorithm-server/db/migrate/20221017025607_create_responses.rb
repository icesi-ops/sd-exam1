class CreateResponses < ActiveRecord::Migration[7.0]
  def change
    create_table :responses do |t|
      t.string :word
      t.boolean :isAdmitted

      t.timestamps
    end
  end
end
