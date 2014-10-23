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

ActiveRecord::Schema.define(version: 20141022032529) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pg_trgm"

  create_table "category_relations", id: false, force: true do |t|
    t.string  "category", limit: 64
    t.integer "train_id"
  end

  add_index "category_relations", ["category", "train_id"], name: "un", unique: true, using: :btree

  create_table "measures", force: true do |t|
    t.integer  "metric_id"
    t.date     "dt"
    t.float    "val"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "measures", ["metric_id", "dt"], name: "measures_metric_id_dt_idx", unique: true, using: :btree

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

  create_table "metrics_sessions", force: true do |t|
    t.integer  "session_id"
    t.integer  "metric_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "metrics_sessions", ["metric_id"], name: "index_metrics_sessions_on_metric_id", using: :btree
  add_index "metrics_sessions", ["session_id"], name: "index_metrics_sessions_on_session_id", using: :btree

  create_table "sessions", force: true do |t|
    t.date     "last_checkin"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "train", id: false, force: true do |t|
    t.integer "id",               null: false
    t.string  "label", limit: 32
    t.integer "i1"
    t.integer "i2"
    t.integer "i3"
    t.integer "i4"
    t.integer "i5"
    t.integer "i6"
    t.integer "i7"
    t.integer "i8"
    t.integer "i9"
    t.integer "i10"
    t.integer "i11"
    t.integer "i12"
    t.integer "i13"
    t.string  "c1",    limit: 64
    t.string  "c2",    limit: 64
    t.string  "c3",    limit: 64
    t.string  "c4",    limit: 64
    t.string  "c5",    limit: 64
    t.string  "c6",    limit: 64
    t.string  "c7",    limit: 64
    t.string  "c8",    limit: 64
    t.string  "c9",    limit: 64
    t.string  "c10",   limit: 64
    t.string  "c11",   limit: 64
    t.string  "c12",   limit: 64
    t.string  "c13",   limit: 64
    t.string  "c14",   limit: 64
    t.string  "c15",   limit: 64
    t.string  "c16",   limit: 64
    t.string  "c17",   limit: 64
    t.string  "c18",   limit: 64
    t.string  "c19",   limit: 64
    t.string  "c20",   limit: 64
    t.string  "c21",   limit: 64
    t.string  "c22",   limit: 64
    t.string  "c23",   limit: 64
    t.string  "c24",   limit: 64
    t.string  "c25",   limit: 64
    t.string  "c26",   limit: 64
  end

end
