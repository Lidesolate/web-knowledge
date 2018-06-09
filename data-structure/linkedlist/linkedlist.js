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
 * 12. count--计算给定数据出现的次数
 * 13. detectLoop--检测列表是否有循环
 * 14. detectAndCountLoop--查询循环长度
 * 15. isPalindrome--判断是否是回文链表
 * 16. removeDuplicates--从排序的链表中删除重复项
 * 17. removeDuplicates--未排序的链表删除重复项
 * 18. swapNodes--交换链表中的节点而不交换数据
 * 19. pairWiseSwap--成对交换链表元素
 * 20. moveToFront--将最后一个元素移动给定链表的前面
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
    return slow;
  }
  /*count(data){
    let count = 0;
    let current = this.head;
    while(current !== null){
      if(current.data === data){
        count++
      }
      current = current.next;
    }
    return count;
  }*/
  count(head, data, count = 0){
    if(head === null){
      return count;
    }
    if(head.data === data){
      count++;
    }
    count = this.count(head.next, data, count);
    return count;
  }
  detectLoop(){
    let current = this.head;
    let hasVisited = [];
    let loopCircle = null;
    while(current !== null){
      if(current.hasCircle){
        console.log(current);
        return true;
      }else{
        current.hasCircle = true;
        current = current.next;
      }
    }
    return false;
  }
  detectAndCountLoop(){
    let i = 0;
    let current = this.head;
    while(current !== null){
      if(!current.hasCircle){
        current.hasCircle = ++i;
        current = current.next; 
      }else{
        return i ;
      }
    }
  }
  isPalindrome(){
    let fast = this.head;
    let slow = this.head;
    let prevArray = [];
    let nextArray = [];
    let size = this.getCount(this.head);
    let flag = true;
    while(fast !== null && fast.next !== null){
      prevArray.push(slow.data);
      fast = fast.next.next;
      slow = slow.next;
    }   
    if(size % 2 !== 0){
      slow = slow.next
    };
    while(slow!==null){
      nextArray.push(slow.data);
      slow = slow.next;
    }
    nextArray.reverse()
    for(let i = 0; i < prevArray.length; i++){
      if(prevArray[i] !== nextArray[i]){
        return false;
      }
    }
    return true;
  }
  /*removeDuplicates(){
    let current = this.head;
    while(current !== null && current.next !== null){
      if(current.data === current.next.data){
        let temp = current.next.next;
        current.next = temp;
      }else{
        current = current.next;
      }
    }
  }*/
  removeDuplicates(){
    let current = this.head;
    let prev = null;
    let visitData = [];
    while(current !== null){
      let data = current.data;
      if(!visitData.includes(data)){
        visitData.push(data);
        prev = current;
      }else{
        prev.next = current.next;
      }
      current = prev.next;
    }
  }
  swapNodes(x, y){
    let current = this.head;
    let a = null, b = null;
    let prev = null;
    let prevA = null, prevB = null;
    while(current !== null){
      if(x === current.data){
        prevA = prev;
        a = current;
      }
      if(y === current.data){
        prevB = prev;
        b = current;
      }
      prev = current;
      current = current.next;
    }
    if(a && b){
      let tempA = a.next;
      let tempB = b.next;
      if(a.next.data === b.data){
        prevA.next = b;
        tempA = tempB;
        b.next = a;
        a.next = tempB;
      }else{
        a.next = null;
        b.next = null;
        prevA.next = b;
        b.next = tempA;
        prevB.next = a;
        a.next = tempB;
      }
    }
  }
  /*pairWiseSwap(){
    let current = this.head;
    while(current !== null && current.next !== null){
      [current.data, current.next.data] = [current.next.data, current.data];
      current = current.next.next;
    }
  }*/
  pairWiseSwap(current){
    if(current === null){ return }
    [ current.data, current.next.data ] = [ current.next.data, current.data ];
    return  this.pairWiseSwap(current.next.next)
  }
  moveInFront(){
    let current = this.head;
    let prevlast = null, last = null;
    while(current !== null && current.next !== null){
      prevlast = current;
      current = current.next;
    }
    last = current;
    prevlast.next = null;
    last.next = this.head;
    this.head = last;

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
linkList.push(6);
linkList.push(5);
linkList.push(4);
linkList.push(3);
linkList.push(2);
linkList.push(1);
//linkList.head.next.next.next.next = linkList.head.next;
linkList.moveInFront();
linkList.print();
//linkList.print();