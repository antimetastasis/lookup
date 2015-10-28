var subTags = {
  srs: ['ShitRedditSays'],
  cb: ['circlebroke']
};

function build() {

  dynTags = {};

  var promises = [];
  var keys = Object.keys(types);
  var promises = keys.map(function(key) {
    return mods(types[key].hub);
  })


  //fold promises
  var promise;
  keys.forEach(function(key, i) {
    if(!i) promise = promises[i];
    promise = promise.then(function(data) {
      data.forEach(tagMod.bind(null, key));
      return promises[i+1];
    });
  });
  return promise.then(function() {
    var pre = $('<pre>').text(JSON.stringify(dynTags, null, '  '));
    $('body').empty().append(pre);
  });
}
function tagMod(tag, mod) {

  var dtmod = dynTags[mod.name];
  //TODO mod permissions/rank
  if(!dtmod) {
    dtmod = dynTags[mod.name] = {
      tags: []
    };
  }
  dtmod.tags = _.union(dtmod.tags, [tag]);
}
