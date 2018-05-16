class node{
  constructor(data){
    this.data = data;
    this.next = null;
  }
}

class Linklist{
  constructor(){
    this.head = null
  }
  push(data){
    let new_node = new node(data);
    new_node.next = this.head;
    this.head = new_node;
  }
  insertAfter(prev_node, data){
    if( prev_node == null ){
      throw new Error('node is not null')
    }
    let new_node = new node(data);
    new_node.next = prev_node.next;
    prev_node.next = new_node;
  }
  append(data){
    let current = this.head;
    let new_node = new node(data);
    if(!current){
      new_node.next = current;
      this.head = new_node;
      return;
    }
    while(current.next !== null){
      current = current.next;
    }
    current.next = new_node;
  }
  deleteNode(data){
    let current = this.head;
    let temp = null;
    while(current !== null && current.data !== data){
      temp = current;
      current = current.next;
    }
    temp.next = current.next;
  }
  print(){
    let current = this.head;
    while(current !== null){
      console.log(current.data);
      current = current.next;
    }
  }
}

const linkList = new Linklist();
linkList.push(7);
linkList.push(1);
linkList.push(3);
linkList.push(2);
linkList.print();
linkList.deleteNode(1);
linkList.print();