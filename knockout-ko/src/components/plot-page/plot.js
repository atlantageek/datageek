define(["knockout", "text!./plot.html"], function(ko, plotTemplate) {
  

  var available_metrics = new ko.subscribable();

  function PlotViewModel(route) {
    var self=this;
    self.selectedMetrics = ko.observableArray();
    self.left_metrics = ko.observableArray();
    self.right_metrics = ko.observableArray();
    self.doit=function() {
      alert("click");
    }
    self.left_scale= function(item) 
    {
      console.log("left on" + item.id);
      var right_pos = self.right_metrics.indexOf(item.id);
      if (right_pos > 0) { self.right_metrics.splice(right_pos,1);}
      self.left_metrics.push(item.id);
      return true;
    }
    self.right_scale= function(item) 
    {
      var left_pos = self.right_metrics.indexOf(item.id);
      if (left_pos > 0) { self.left_metrics.splice(left_pos,1);}
      self.right_metrics.push(item.id);
      console.log("right on" + item.id);
      return true;
    }
    self.no_scale= function(item) 
    {
      console.log("no on" + item.id);
      left_pos = right_metrics.indexOf(item.id);
      left_metrics.splice(left_pos,1);
      right_pos = right_metrics.indexOf(item.id);
      right_metrics.splice(right_pos,1);
      return true;
    }
    console.log("plot view model");
    session_id = $.cookie('geek_session')
      $.ajax({url:"/session/show_dtls/" + session_id,
	    type: 'GET',
	    context: document.body,
	    dataType: "JSON"}).done(function(data) {
              for (i=0;i<data.series.length;i++)
              {
                data_item = data.series[i];
                self.selectedMetrics.push( data_item);
              }
      });
  }
  return { viewModel: PlotViewModel, template: plotTemplate };

});

