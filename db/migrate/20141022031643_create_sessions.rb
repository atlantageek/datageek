class CreateSessions < ActiveRecord::Migration
  def change
    create_table :sessions do |t|
      t.date :last_checkin

      t.timestamps
    end
  end
end
