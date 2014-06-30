# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140623223435) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pg_trgm"

  create_table "measures", force: true do |t|
    t.integer  "metric_id"
    t.date     "dt"
    t.float    "val"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "metrics", force: true do |t|
    t.string   "file"
    t.string   "title"
    t.string   "unit"
    t.string   "frequency"
    t.string   "seasonal_adjustment"
    t.string   "last_updated"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.tsvector "title_text"
    t.float    "random_val"
  end

  add_index "metrics", ["title_text"], name: "posttext_gin", using: :gin
  add_index "metrics", ["title_text"], name: "title_text_gin", using: :gin

end
