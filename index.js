var Snoocore = window.Snoocore;
var reddit = new Snoocore({
  userAgent: 'lookup@src',
  oauth: {
    type: 'implicit',
    key: 'twGlYBQfNNk6WQ',
    redirectUri: 'http://localhost:8000',
    scope: ['read'],
    deviceId: 'DO_NOT_TRACK_THIS_DEVICE'
  }
});


//gets the list of mods for a sub, plus rankings
function mods(sub) {
  return reddit('/r/$sub/about/moderators').get({
    $sub: sub
  }).then(function(data) {
    var childs = data.data.children;
    childs.forEach(function(v, i) {
      v.rank = i/(childs.length-1);
    });
    return childs;
  }, function(err) {
    return null;
  });
}


var types = {
  srs: {
    name: 'the ShitRedditSays network',
    color: 'red',
    hub: 'ShitRedditSays'
  },
  cb: {
    name: 'r/circlebroke',
    color: 'red',
    hub: 'circlebroke'
  },
  imm: {
    name: 'immune (bots)',
    color: 'gray'
  }
};

angular.module('cancerLookup', [])
.controller('LookupCtrl', ['$scope', function($scope) {

  //don't spam reddit with requests
  var tryLookup = _.debounce(function() {
    $scope.sub && lookup($scope.sub);
  }, 400);

  //get the list of mods and write to data
  function lookup(sub) {
    $scope.stage = 'SENT';
    $scope.$digest();
    mods(sub).then(function(data) {
      //do nothing if they started typing again
      if($scope.sub !== sub) return;
      $scope.data = data;
      $scope.stage = data ? 'IDLE' : 'ERROR';
      $scope.$digest();
    });
  }

  $scope.data = null;
  $scope.tags = tags;
  $scope.types = types;

  $scope.stage = 'IDLE';

  //type event
  $scope.subType = function() {
    if(!$scope.sub) {
      $scope.stage = 'IDLE';
      $scope.data = null;
      return;
    }
    $scope.stage = 'TYPING';
    tryLookup();
  };
}]);
