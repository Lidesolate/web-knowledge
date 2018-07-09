class myVue {
  constructor(opts){
    if(opts.data){
      this.initData(opts.data);
    }
  }
  initData(data){
    this._data = typeof data === 'function' ? data.call(this) : data;
    this.initProxy(this._data);
    this.observe(this._data);
    
  }
  initProxy(data){
    let vm = this;
    let keys = Object.keys(data);
    for(let key of keys){
      Object.defineProperty(vm, key, {
        get(){
          return vm._data[key];
        },
        set(val){
          vm._data[key] = val;
        }
      })
    }
  }
  observe(data){
    if(Object.prototype.toString.call(data) !== '[object Object]') return; 
    let ob = new Observe(data, this);
    return ob;
  }
}

// 响应式
class Observe{
  constructor(data, self){
    this.vm = self;
    this.$data = data;
    this.dep = new Dep();
    this.def(data, '_ob_', this);
    this.walk(data);
  }
  walk(obj){
    const keys = Object.keys(obj);
    for(let key of keys){
      this.defineReactive(obj, key);
    }
  }
  def(obj, key, self){
    Object.defineProperty(obj, key, {
      value: {
        value: obj,
        dep: new Dep(),
      }
    })
  }
  defineReactive(obj, key){
    const dep = new Dep();
    let val = obj[key];
    let childOb = this.vm.observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function recativeGetter(){
        const value = val;
        if(Dep.target){
          dep.depend();
          if(childOb){
            childOb.dep.depend();
          }
        }
        return value;
      },
      set: function recativeSetter(newVal){
        const value = val;
        if(newVla === value){
          return;
        }
        val = newVal;
        childOb = this.vm.observer(newVal);
        dep.notify();
      }
    })
  }
} 

// 依赖收集
class Dep{
  constructor(){
    this.subs = [];
  }
  addSub(sub){
    this.subs.push(sub)
  }
  depend(){
    Dep.target.addDep(this);
  }
  notify(){
    for(let sub of this.subs){
      sub.update();
    }
  }
}

// 检测函数



Dep.target = null;

let app = new myVue({
  data(){
    return {
      a: {
        b: 1
      }
    }
  }
})


console.log(app._data._ob_);

