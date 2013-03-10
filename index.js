(function(){
  var fs, path, callsite, empty, concatMap, flatten, slice$ = [].slice, toString$ = {}.toString;
  fs = require('fs');
  path = require('path');
  callsite = require('callsite');
  empty = function(it){
    return it.length === 0;
  };
  concatMap = curry$(function(f, list){
    var x, xs;
    x = list[0], xs = slice$.call(list, 1);
    switch (false) {
    case !empty(list):
      return [];
    default:
      return f(x).concat(concatMap(f, xs));
    }
  });
  flatten = function(arr){
    switch (false) {
    case toString$.call(arr).slice(8, -1) !== 'Array':
      return concatMap(flatten, arr);
    default:
      return [arr];
    }
  };
  module.exports = function(dir, caller){
    var resolved, file, full;
    caller == null && (caller = __stack[1].getFileName());
    resolved = path.resolve(path.dirname(caller), dir);
    return flatten(
    (function(){
      var i$, ref$, len$, ref1$, results$ = [];
      for (i$ = 0, len$ = (ref$ = fs.readdirSync(resolved)).length; i$ < len$; ++i$) {
        file = ref$[i$];
        switch (ref1$ = [full = path.join(resolved, file)], false) {
        case !compose$([fn$, fs.statSync])(ref1$[0]):
          results$.push(module.exports(path.join(dir, file), caller));
          break;
        case !compose$([(fn1$), path.extname])(ref1$[0]):
          results$.push(require(full));
        }
      }
      return results$;
      function fn$(it){
        return it.isDirectory();
      }
      function fn1$(it){
        return it in require.extensions;
      }
    }()));
  };
  if (module === require.main) {
    console.log(module.exports("test"));
  }
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
  function compose$(fs){
    return function(){
      var i, args = arguments;
      for (i = fs.length; i > 0; --i) { args = [fs[i-1].apply(this, args)]; }
      return args[0];
    };
  }
}).call(this);
