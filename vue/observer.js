let target = null;

class myVue {
  constructor(opts){
    if(opts.data){
      this.initData(opts.data);
    }
    this.target = null;
  }
  initData(data){
    if(typeof data === 'function'){
      let $data = this._data = data.call(this);
      this.initProxy(this._data);
      this.depCollection(this._data);
    }
  }
  initProxy(data){
    let keys = Object.keys(data);
    for(let key of keys){
      Object.defineProperty(this, key, {
        get(){
          return this._data[key];
        },
        set(value){
          this._data[key] = value;
        }
      })
    }
  }
  depCollection(data){
    for(let key in data){
      let dep = [];
      let self = this;
      let val = data[key];
      if(Object.prototype.toString.call(val) === '[object Object]'){
        this.depCollection(val);
      }
      Object.defineProperty(data, key, {
        set(newVal){
          if(val === newVal) return;
          val = newVal;
          dep.forEach(fn => fn())
        },
        get(){
          dep.push(self.target);
          return val;
        }
      })
    }
  }
  $watch(exp, fn){
    this.target = fn;
    let reg = /\./;
    let obj = this._data;
    if(typeof exp === 'function'){
      exp();
      return;
    }
    if(reg.test(exp)){
      let parent = exp.split('.');
      parent.forEach(key => {
        obj = obj[key];
      })
      return;
    }
    this._data[exp]
  }
}

let app = new myVue({
  data(){
    return {
      a: 1,
      b: {
        c: 2,
      }
    }
  }
})

function render(){
  console.log(app.a, app.b.c);
}

app.$watch(render, render);
app.b.c = 3
console.log(app.b.c);