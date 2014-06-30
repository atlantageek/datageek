var app = angular.module("MetricdbRails", []);

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
  $scope.drawMe = function(metric) { 
    $http({method: "GET", url: "/metrics/show/"+metric.id})
      .success(function(data) {
        var data_translated=[];
        var labels = [];
        for(var i=0;i<data.length;i++) { data_translated[i] = [i,data[i][1]];}
        for (var i=0;i<data.length;i+=Math.round(data.length / 5))
        {
          labels.push([i,data[i][0]]);
        }
        $.plot('#placeholder', [data_translated], {xaxis:{ticks:labels}});
  });}

  $scope.getSearchData = function() {
    var pattern = $scope.pattern2
    console.log($scope.pattern2);
    $http({method: "GET", url: "/metrics/index", params: {term: $scope.pattern2}})
      .success(function(data) {
        $scope.metrics=data;
        for(var i=0;i<$scope.metrics.length;i++)
        {
          $scope.metrics[i].selected=SelectedSeriesService.has_metric($scope.metrics[i].id);
        }
      });
  }
  $scope.hasSelections = function() {
    console.log("WTF" + SelectedSeriesService.empty());
    return !SelectedSeriesService.empty();
  }
  $scope.getSelectedData = function() {
    data={metric_list: SelectedSeriesService.get_list()};
    $http({method: "GET", url: "/metrics/selected", params: data})
      .success(function(data) {
        $scope.metrics=data;
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
    }
    console.log(SelectedSeriesService.display_list());
    console.log($scope.greetings);
  }
  $scope.metric_list = function() {
    return SelectedSeriesService.get_list;
  }
});
