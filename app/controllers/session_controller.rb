class SessionController < ApplicationController

  protect_from_forgery :except => :set
  def new
    @session = Session.create()
    render json: @session
  end

  def set
    MetricsSessions.destroy_all(:session_id => params["session"])
    list= params["list"]
    list.each do |metric_id|
     if (MetricsSessions.where(:session_id => params["session"], :metric_id => metric_id).count() == 0)
        MetricsSessions.create!(:session_id => params["session"], :metric_id => metric_id)
     end
    end
    render json: {}
  end

  def show
    session_id = params[:id]
    metric_ids= []
    MetricsSessions.where(:session_id => session_id).each {|ms| metric_ids.push(ms.metric_id)}
    render json: {id: session_id, series: metric_ids}
  end
  def show_dtls
    session_id = params[:id]
    metric_ids= []
    MetricsSessions.where(:session_id => session_id).each {|ms| metric_ids.push(ms.metric_id)}
    metrics =Metric.select("title, id").where("id in (#{metric_ids.join(',')})").order("title").limit(1001).collect do |metric|
      min_dt = Measure.where(metric_id: metric.id).minimum(:dt)
      max_dt = Measure.where(metric_id: metric.id).maximum(:dt)
      {title: metric.title,  id:metric.id, min_dt: min_dt, max_dt: max_dt}
    end
    render json: {id: session_id, series: metrics}
  end
end
