/**
 * 
 * TODO:
 * 
 * 1.  push--在前面添加节点
 * 2.  insertAfter--在给定节点后添加一个节点
 * 3.  append--在最后添加一个节点
 * 4.  deleteKey--删除指定位置的数据
 * 5.  deleteNode--删除制定数据
 * 6.  print--打印出所有节点数据
 * 7.  getCount--打印链表长度(递归和循环)
 * 8.  search--搜索链表中的元素(递归和循环)
 * 9.  getNth--获取链表中的第n个节点
 * 10. printNthFromLast--从链表列表末尾开始第n个节点
 * 11. printMiddle--打印链表中间部分
 * 
 * 
 */
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
  deleteKey(pos){
    if(this.head === null){ return };
    let current = this.head;
    let temp = null;
    if(pos === 0){
      this.head = current.next;
    }
    while(pos > 0){
      temp = current;
      current = current.next;
      pos--;
    }
    if(temp === null || temp.next === null) return;
    temp.next = current.next;
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
  /*getCount(){
    let count = 0;
    let current = this.head;
    while(current !== null){
      count++;
      current = current.next;
    }
    console.log(count);
  }*/
  getCount(current){
    if(current === null){
      return 0;
    }
    return 1 + this.getCount(current.next);
  }
  /*search(data){
    let current = this.head;
    while(current !== null){
      if(current.data === data){ 
        return true;
      }else{
        current = current.next;
      }
    }
    return false;
  }*/
  search(current, data){
    if(current === null){ return false };
    if(current.data !== data){
      return this.search(current.next, data);
    }else{
      return true;
    }
  }
  getNth(index){
    let current = this.head;
    let count = 1;
    while(current !== null){
      if(index === count){
        return current.data;
      }
      current = current.next;
      count++;
    }
  }
  printNthFromLast(n){
    let current = this.head;
    let size = this.getCount(this.head);
    let len = size - n;
    while(len > 0){
      current = current.next;
      len--;
    }
    return current.data;
  }
  printMiddle(){
    let fast = this.head;
    let slow = this.head;
    if(this.head !== null){
      while(fast !== null && fast.next !== null){
        fast = fast.next.next;
        slow = slow.next;
      }
    }
    return slow.data;
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
linkList.push(1);
linkList.push(2);
linkList.push(3);
linkList.push(4);
linkList.push(5);
console.log(linkList.printMiddle());
//linkList.print();