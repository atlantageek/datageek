class MetricsSessions < ActiveRecord::Base
  belongs_to :session
  belongs_to :metric
end
