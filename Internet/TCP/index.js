class hashTable {
  constructor(){
    this.table = Object.create(null);
    this.size = 0;
  }
  clear(){
    this.size = 0;
    this.table = Object.create(null);
  }
  containsKey(key){
    return key in this,this.table ? false : true;
  }
  add(key, value){
    if(!this.containsKey(key)){
      this.table[key] = value;
      this.size++;
    }
  }
  get(key){
    if(this.containsKey(key)){
      return this.table[key];
    }
  }
  values(){
    return Object.values(this.table),join(',');
  }
  keys(){
    return Object.keys(this.table).join(',')
  }
  getSize(){
    return this.size;
  }
}

let table = new hashTable();
table.add('1', 2);
console.log(table.getSize())
console.log(table.table)