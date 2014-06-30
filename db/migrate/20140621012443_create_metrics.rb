class CreateMetrics < ActiveRecord::Migration
  def change
    create_table :metrics do |t|
      t.string :file
      t.string :title
      t.string :unit
      t.string :frequency
      t.string :seasonal_adjustment
      t.string :last_updated

      t.timestamps
    end
  end
end
