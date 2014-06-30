class MetricsController < ApplicationController
  def index
    pattern = params[:term]
    pattern = pattern.strip.gsub(/\s+/," & ")
    @metrics =Metric.where("title_text @@ to_tsquery('#{pattern}') ").order('random_val').limit(30).collect do |metric|
      {title: metric.title, unit: metric.unit, frequency: metric.frequency, id:metric.id}
    end
    render json: @metrics
  end
  def selected
    metric_list = params[:metric_list]
    @metrics =Metric.where("id in (#{JSON.parse(metric_list).join(',')}) ").collect do |metric|
      {title: metric.title, unit: metric.unit, frequency: metric.frequency, id:metric.id}
    end
    @metrics.map! do |metric|
      metric[:max] = Measure.maximum(:dt, :conditions => {:metric_id=>metric[:id]})
      metric[:min] = Measure.minimum(:dt, :conditions => {:metric_id=>metric[:id]})
      metric
    end
puts @metrics
    render json: @metrics
  end

  def show
    metric_id = params[:id]
    result = []
    Measure.where("metric_id=?",[metric_id]).order('dt').each { |meas|
      result.push([meas.dt, meas.val]);
    }
    render json: result
  end
end
