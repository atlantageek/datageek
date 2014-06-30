desc "Rake task to load metric data"
task :load_metric_data_db => :environment do
  puts "Starting"
  CSV.read('../README_SERIES_ID_SORT.txt',  col_sep:';').each do |row|
    Metric.create({:file=> row[0], :title=>row[1], :unit=>row[2], :frequency=>row[3], :seasonal_adjustment=>row[4]})
  end
end
