class CreateMeasures < ActiveRecord::Migration
  def change
    create_table :measures do |t|
      t.integer :metric_id
      t.date :dt
      t.float :val

      t.timestamps
    end
  end
end
