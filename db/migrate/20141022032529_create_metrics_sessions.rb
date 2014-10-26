class CreateMetricsSessions < ActiveRecord::Migration
  def change
    create_table :metrics_sessions do |t|
      t.references :session, index: true
      t.references :metric, index: true

      t.timestamps
    end
  end
end
