define(["knockout", "text!./home.html"], function(ko, homeTemplate) {
  
  var available_metrics = new ko.subscribable();

  function HomeViewModel(route) {
    var self=this;
    self.message = ko.observable('Welcome to chartpoint!');
    self.pattern = ko.observable('');
    self.canidates = ko.observableArray();
    self.selected = ko.observableArray();
    self.busy_search = ko.observable(false);
    self.entry_timer = 0;
    self.show_bookmarks = ko.observable(false);
    self.show_bookmarks.subscribe(function() {
      session_id = $.cookie('geek_session')
      if (self.show_bookmarks() == true) { self.updateMetricList({bookmarks: session_id});}
      else { 
          self.updateMetricList({term: self.pattern()});
      }
    });


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
    self.sparkit = function(item)
    {
      var id = item['id']();
      $.ajax({url:"/metrics/show/" + id}).
        done(function(raw_data) {
          metric_id = raw_data['id'];
          timeseries = raw_data['series'];
          self.process_graph_data(timeseries, metric_id);
        });
    }
    self.toggle_select = function(item)
    {
      var id = item['id'];
      console.log("toggle:" + id());
      idx = self.selected().lastIndexOf(id());
      if (idx == -1)
      {
        self.selected().push(id());
        
      }
      else
      {
        self.selected().splice(idx,1);
      }
      session_id = $.cookie('geek_session')
      $.ajax({url:"/session/set",
	    data: {list: self.selected(), session: session_id},
	    type: 'POST',
	    context: document.body,
	    dataType: "JSON"}).done(function(data) {});
      for (var i=0;i<self.canidates().length;i++)
      {
        if (self.selected().lastIndexOf(self.canidates()[i].id()) == -1)
        {
          self.canidates()[i].star_class("glyphicon glyphicon-star-empty");
        }
        else
        {
          self.canidates()[i].star_class("glyphicon glyphicon-star");
        }
      }
    }

    self.canidate_count = function()
    {
      if (self.canidates().length > 1000)
      {
        return '+1000 results found. Add terms to narrow results';
      }
      else
      {
        return self.canidates().length + " results found. ";
      }
    }

    self.update_selections = function()
    {
      session_id = $.cookie('geek_session')
      $.ajax({url:"/session/show/" + session_id,
	    type: 'GET',
	    context: document.body,
	    dataType: "JSON"}).done(function(data) {
              for (i=0;i<data.series.length;i++)
              {
                data_item = data.series[i];
                self.selected().push(data_item);
              }
      });
    }
    self.update_selections();
    self.updateMetricList = function(search_criteria) {
      self.busy_search(true);
      $.ajax({url:"/metrics/index",
        data: search_criteria,
	  type: 'GET',
	  context: document.body ,
	  dataType: "JSON"}).done(function(data) {
	    self.canidates.removeAll();
	    for (i=0;i<data.length;i++)
	    {
              data[i]['id_class'] = 'cl_' + data[i]["id"];
              console.log(self.selected());
	      self.canidates.push(new Series(data[i],self.selected())); 
	      idx = self.canidates().length - 1;
	     // $.ajax({url:"/metrics/show/" + data[i]["id"]}).
             // done(function(raw_data) { 
             //   metric_id = raw_data['id'];
             //   timeseries = raw_data['series'];

             //   self.process_graph_data(timeseries, metric_id);
             // }); 
            }
	  console.log(self.canidates().length);
          self.busy_search(false);
	  });
    }
    self.updatePattern = function() {
      if (self.entry_timer)
      {
        clearTimeout(self.entry_timer);
      }
        self.entry_timer = setTimeout(function() {
          self.updateMetricList({term: self.pattern()});
	  return true;
        }, 600);
  };


  }


  function Series(data,selected)
  {
    var self = this;
    self.title = ko.observable(data.title);
    self.unit = ko.observable(data.unit);
    self.frequency = ko.observable(data.frequency);
    //this.star_class;// = ko.observable("glyphicon glyphicon-star-empty");
        if (selected.lastIndexOf(data.id) == -1)
        {
          self.star_class=ko.observable("glyphicon glyphicon-star-empty");
        }
        else
        {
          self.star_class=ko.observable("glyphicon glyphicon-star");
        }
    self.id_class = ko.observable(data["id_class"]);
    self.id = ko.observable(data["id"]);
  }

  HomeViewModel.prototype.doSomething = function() {
    this.message('You- invoked doSomething() on the viewmodel.');
  };
  $(document).ready(function() {
      if ($.cookie('geek_session') == null)
      {
        $.ajax({
          url: '/session/new',
          type: 'GET'
          }).done(function(data) {
          console.log(data);
            $.cookie('geek_session', data['id'])
        });
      }
  });

  return { viewModel: HomeViewModel, template: homeTemplate };

});

