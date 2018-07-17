function co(gen, ...args){
  let ctx = this;
  return new Promise(function(resolve, reject){
    if(typeof gen === 'function') gen = gen.apply(ctx, args);
    if(!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulilled();
    function onFulilled(res){
      let ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
      return null;
    }

    function onRejected(err){
      let ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function next(ret){
      if(ret.done) return resolve(ret.value);
      let value = toPromise.call(ctx, ret.value);
      if(value && isPromise(value)) return value.then(onFulilled, onRejected);
    }

    function toPromise(obj){
      if(!obj) return obj;
      if(isPromise(obj)) return obj;
      if(isGenerator(obj)) return co.call(this, obj);
      if(Array.isArray(obj)) return arrayToPromise.call(this, obj);
      return obj;
    }

    function isPromise(obj){
      return 'function' === typeof obj.then;
    }
    function isGenerator(obj){
      return 'function' == typeof obj.next && 'function' == typeof obj.throw;
    }
    function arrayToPromise(arr){
      return Promise.all(arr.map(toPromise, this));
    }
  })
}

co(function* (){
  let a = yield Promise.resolve(1);
  let b = yield Promise.resolve(2);
  let c = yield Promise.resolve(3);
  let result = yield [a, b, c];
  return result
}).then((result) => {
  console.log(result);
})

