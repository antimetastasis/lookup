
var staticTags = {
  AutoModerator: {
    tags: ['imm'],
    desc: 'Configurable mod bot for many subs'
  }
};

var tags = getTags();

function getTags() {
  return mergeTags({}, dynTags, staticTags);
}

function mergeTags(dst, src) {

  for(var key in src) {
    //if it doesn't exist, assign, else merge tags
    if(!(key in dst)) {
      dst[key] = _.cloneDeep(src[key]);
    } else {
      dst[key].tags = _.union(dst[key].tags, src[key].tags);

      //immune mods stay immune
      if(dst[key].tags.indexOf('imm') !== -1) dst[key].tags = ['imm'];
    }
  }

  //works like assign
  if(arguments.length > 2) {
    var recArgs = [].slice.call(arguments);
    recArgs.splice(1,1);
    return mergeTags.apply(this, recArgs);
  } else {
    return dst;
  }

}
