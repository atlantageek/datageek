var app = angular.module("bobApp");
calculate_date_day = function(dt){
    elems = dt.split("-");
    y = parseInt(elems[0]);
    m = parseInt(elems[1]);
    d = parseInt(elems[2]);
    days_by_month_idx = [0,0,31,59,90,120,151,181,212,243,273,304,334,365]
    y = y - m/10
    var result = 365*y + y/4 - y/100 + y/400 + (days_by_month_idx[m]) + d
    return result
}
get_year = function(dt){
    elems = dt.split("-");
    return elems[0];
}
generate_date = function(nbr)
{
  var months=['Jan','Feb','Mar','Apr','May','Jun','Jul', 'Aug','Sept','Oct','Nov', 'Dec']
  var y = Math.floor(nbr*10000/3652425);
  var ddd = nbr - Math.floor(y*365.2425);
  days_by_month_idx = [0,31,59,90,120,151,181,212,243,273,304,334,365]
  var month;
  for (i=0;i<days_by_month_idx.length;i++)
  {
    if (((ddd <= days_by_month_idx[i+1]) &&  (ddd > days_by_month_idx[i])) ||
      (i == days_by_month_idx.length) )
    {
      month = months[i % 12]
    }
  }
  var mi = (100*ddd + 52)/3060;
  var mm = (mi + 2)%12 + 1;
  y = y + (mi + 2)/12;
  var dd = ddd - (mi*306 + 5)/10 + 1;
  return month + "-" + Math.round(y)  ;
}

app.directive("clickToEdit", function() {
    var editorTemplate = '<div class="click-to-edit">' +
        '<div ng-hide="view.editorEnabled">' +
            '{{value}} ' +
            '<a ng-click="enableEditor()">Edit</a>' +
        '</div>' +
        '<div ng-show="view.editorEnabled">' +
            '<input ng-model="view.editableValue">' +
            '<a href="#" ng-click="save()">Save</a>' +
            ' or ' +
            '<a ng-click="disableEditor()">cancel</a>.' +
        '</div>' +
    '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=clickToEdit",
        },
        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                $scope.value = $scope.view.editableValue;
                $scope.disableEditor();
            };
        }
    };
});


app.service('SelectedSeriesService', function() {
  this.metric_list=[];
  this.has_metric = function(id) {
    return (this.metric_list.indexOf(id) != -1)
  }

  this.empty = function() {
    if (this.metric_list == 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  this.get_list = function() { 
    return this.metric_list; 
  }
  this.display_list = function() { 
    return this.metric_list.join(","); 
  }

  this.remove_metric = function(id) { 
    idx = this.metric_list.indexOf(id);
    if (idx != -1)
    {
      this.metric_list.splice(idx,1);
    }
  }
  this.add_metric = function(id) { 
    if (!this.has_metric(id)){ 
      this.metric_list.push(id); 
    }
  }
});

app.config(['$routeProvider',
  function($routeProvider, SelectedSeriesService) {
    $routeProvider.
      when('/SelectSeries', {
        templateUrl: 'templates/select_series.html',
        controller: 'MetricSearchCtrl'
      }).
      when('/CombineSeries', {
        templateUrl: 'templates/combine_series.html'
      }).
      otherwise({
        redirectTo: '/SelectSeries'
      });
}]);

app.controller("MetricSearchCtrl", function($scope, $http,$location, SelectedSeriesService) {
  $scope.greetings = "Hola!";
  $scope.yaxis1_title = "Left Axis";
  $scope.yaxis2_title = "Right Axis";
  $scope.yaxis_select = {options : 
                      [{label: 'none', value: 'none'}, 
                      {label:'Left Y-Axis', value:'left'},
                      {label:'Right Y-Axis', value:'right'}]
                      };
  $scope.month_list = {options : 
                      [
                      {label: 'Jan.',month_idx:"01"}, 
                      {label:'Feb.', month_idx:"02"},
                      {label:'March',month_idx:"03"},
                      {label: 'April',month_idx:"04"}, 
                      {label:'May', month_idx:"05"},
                      {label:'June',month_idx:"06"},
                      {label: 'July',month_idx:"07"}, 
                      {label:'Aug.', month_idx:"08"},
                      {label:'Sept.',month_idx:"09"},
                      {label: 'Oct.',month_idx:"10"}, 
                      {label:'Nov.', month_idx:"11"},
                      {label:'Dec.',month_idx:"12"} ] };
  $scope.year_list = {options : 
                      [ ] };

  $scope.drawMe = function(metric, location) { 
    $http({method: "GET", url: "/metrics/show/"+metric.id})
      .success(function(data) {
        var data_translated=[];
        var labels = [];
        for(var i=0;i<data.length;i++) { data_translated[i] = [calculate_date_day(data[i][0]),data[i][1]];}
        for (var i=0;i<data.length;i+=Math.round(data.length / 5))
        {
          labels.push([i,data[i][0]]);
        }
        $.plot(location, [data_translated], {xaxis:{ticks:labels}});
  });}
  $scope.drawMetrics = function(location) { 
    var cnt=0;
    for (var midx=0;midx < $scope.selected_metrics.length; midx++)
    {
      cnt+=1;
      var data_collected=[];
      var metric=$scope.selected_metrics[midx]
      $http({method: "GET", url: "/metrics/show/"+metric.id, 
            params: {start_date: $scope.start_year.label + "-" + $scope.start_month.month_idx + "-01",
            end_date: $scope.end_year.label + "-" + $scope.end_month.month_idx + "-01"}})
        .success((
          function(metric,location){ 
          return function(data) {
          var data_translated=[];
          var labels = [];
          for(var i=0;i<data.length;i++) 
          {  
             dt_nbr = calculate_date_day(data[i][0]);
             data_translated[i] = [dt_nbr,data[i][1]];
          }
          cnt -=1;
          yaxis_idx=1;
          if (metric.axis.value == "left")
          {
            yaxis_idx=1;
          }
          if (metric.axis.value == "right")
          {
            yaxis_idx=2;
          }
          if (metric.axis.value != "none")
          {
            data_collected.push({data:data_translated, yaxis:yaxis_idx, label: metric.title});
            if (cnt == 0) { 
              $.plot("#placeholder2", data_collected, 
               {axisLabels:{show: true},
                xaxes:[{ticks:5, tickFormatter:generate_date, axisLabel: "Date" , axisLabelUseCanvas: true}], 
                yaxes: [{position:"left", axisLabel: $scope.yaxis1_title, axisLabelUseCanvas: true}, 
                        {position:"right", axisLabel: "$scope.yaxis2_title", axisLabelUseCanvas: true}] 
               } );
            }
          }
          else
          {$("#placeholder2").empty();}
      }})(metric,location));
    }
  }


  $scope.getSearchData = function(pattern) {
    //var pattern = $scope.pattern2
    console.log($scope.pattern2);
    $http({method: "GET", url: "/metrics/index", params: {term: $scope.pattern2}})
      .success(function(data) {
        $scope.first_year = null;
        $scope.common_first_year = null;
        $scope.last_year = null;
        $scope.common_last_year = null;
        $scope.metrics=data;
        for(var i=0;i<$scope.metrics.length;i++)
        {
          $scope.metrics[i].selected=SelectedSeriesService.has_metric($scope.metrics[i].id);
        }
      });
  }
  $scope.hasSelections = function() {
    return !SelectedSeriesService.empty();
  }
  $scope.getSelectedData = function() {
    data={metric_list: SelectedSeriesService.get_list()};
    $http({method: "GET", url: "/metrics/selected", params: data})
      .success(function(data) {
        $scope.selected_metrics=data;
        for(var i=0;i<$scope.selected_metrics.length;i++)
        {
          $scope.selected_metrics[i].axis=$scope.yaxis_select['options'][0];
          if ($scope.first_year == null || $scope.first_year > get_year($scope.selected_metrics[i].min)) {
            $scope.first_year = get_year($scope.selected_metrics[i].min);
          }
          if ($scope.last_year == null || $scope.last_year < get_year($scope.selected_metrics[i].max)) {
            $scope.last_year = get_year($scope.selected_metrics[i].max);
          }
        }
        for (var i=parseInt($scope.first_year);i< parseInt($scope.last_year);i++)
        {
          $scope.year_list.options.push({label: "" + i});
        }
        $scope.year_list
      });
  }
  $scope.selectMetric = function(metric) {
    console.log(metric.selected);
    if (metric.selected)
    {
      SelectedSeriesService.add_metric(metric.id);
    }
    else
    {
      SelectedSeriesService.remove_metric(metric.id);
      $scope.first_year = null;
    }
    $scope.getSelectedData();
    console.log(SelectedSeriesService.display_list());
    console.log($scope.greetings);
  }
  $scope.metric_list = function() {
    return SelectedSeriesService.get_list;
  }});
