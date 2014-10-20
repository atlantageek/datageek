define(["knockout", "text!./home.html"], function(ko, homeTemplate) {
  
  function HomeViewModel(route) {
    var self=this;
    self.message = ko.observable('Welcome to chartpoint!');
    self.pattern = ko.observable('');
    self.canidates = ko.observableArray();
    self.selected = ko.observableArray();
    self.entry_timer = 0;

    self.process_graph_data = function (data,idx)
    {
      datastream = data.map(function(val){return val[1];}).
        filter(function(val,idx,orig){
          cnt=Math.floor(orig.length/12);
          return ((idx % cnt) == 0);});
      sel=".cl_" + idx + " td .inlinesparkline";
      console.log("XX" + data.length + "," + datastream.length);
      $(sel).sparkline(datastream);
    }
    self.id_class = function(idx)
    {
      "bob_"+idx;
    }
    self.is_selected = function(item)
    {
      var id = item['id'];
      idx = self.selected().lastIndexOf(id);
      console.log("ID=" + id);
      if (idx == -1) {return false;}
      return true;
    }
    self.toggle_select = function(item)
    {
      var id = item['id'];
      console.log("toggle");
      idx = self.selected().lastIndexOf(id);
      if (idx == -1)
      {
        self.selected().push(id);
        
      }
      else
      {
        self.selected().splice(idx,1);
      }
      for (var i=0;i<self.canidates().length;i++)
      {
        if (self.selected().lastIndexOf(self.canidates()[i].id) == -1)
        {
          self.canidates()[i]["star_class"] = ko.observable("glyphicon glyphicon-star-empty");
        }
        else
        {
          self.canidates()[i]["star_class"] = ko.observable("glyphicon glyphicon-star");
        }
      }
    }

    self.updatePattern = function() {
      if (self.entry_timer)
      {
        clearTimeout(self.entry_timer);
      }
        self.entry_timer = setTimeout(function() {
	  $.ajax({url:"/metrics/index",
	    data: {term: self.pattern()},
	    type: 'GET',
	    context: document.body ,
	    dataType: "JSON"}).done(function(data) {
	    self.canidates.removeAll();
	    for (i=0;i<data.length;i++)
	    {
        if (self.selected().lastIndexOf(data[i]["id"]) == -1)
        {
          data[i]["star_class"] = "glyphicon glyphicon-star-empty";
        }
        else
        {
          data[i]["star_class"] = "glyphicon glyphicon-star";
        }
              data[i]['id_class'] = 'cl_' + data[i]["id"];
	      self.canidates.push(data[i]); 
	      idx = self.canidates().length - 1;
	      $.ajax({url:"/metrics/show/" + data[i]["id"]}).
              done(function(raw_data) { 
                metric_id = raw_data['id'];
                timeseries = raw_data['series'];

                self.process_graph_data(timeseries, metric_id);
              });
		}
	  console.log(self.canidates().length);
	  });
	  return true;
        }, 400);
  };
  }

  HomeViewModel.prototype.doSomething = function() {
    this.message('You- invoked doSomething() on the viewmodel.');
  };

  return { viewModel: HomeViewModel, template: homeTemplate };

});
