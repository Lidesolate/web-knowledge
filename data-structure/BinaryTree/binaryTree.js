/**
 * 
 * TODO: 
 * 1. insert--在二叉树添加节点
 * 2. order--前序遍历,中序遍历,后序遍历
 * 
 * 
 * 
 */
class node {
  constructor(data){
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class binaryTree{
  constructor(data){
    this.root = new node(data);
  }
  insert(data){
    let current = this.root;
    let queue = [];
    queue.push(current);
    while(queue.length !== 0){
      let temp = queue.pop();
      if(!temp.left){
        temp.left = new node(data);
        break;
      }else{
        queue.push(temp.left);
      }

      if(!temp.right){
        temp.right = new node(data);
        break
      }else{
        queue.push(temp.right);
      }
    }
  }
  inorder(node, callback){
    if(node === null){
      return;
    }
    this.inorder(node.left,callback);
    if(callback){
      callback(node);
    }
    this.inorder(node.right, callback);
  }
  preorder(node, callback){
    if(node === null){
      return;
    }
    if(callback){
      callback(node);
    };
    this.preorder(node.left, callback);
    this.preorder(node.right, callback);
  }
  postorder(node, callback){
    if(node === null){
      return;
    }
    this.postorder(node.left, callback);
    this.postorder(node.right, callback);
    if(callback){
      callback(node);
    }
  }
}

let binarytree = new binaryTree(0);
binarytree.insert(1);
binarytree.insert(2);
binarytree.insert(3);
binarytree.inorder(binarytree.root, (node) => console.log(node.data));
binarytree.preorder(binarytree.root, (node) => console.log(node.data));
binarytree.postorder(binarytree.root, (node) => console.log(node.data));