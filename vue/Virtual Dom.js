function patch(node, patches){
  let walker = {index: 0}
  dfsWalk(node, walker, patches);
}

function dfsWalk(node, walker, patches){
  let currentPatches = patches[walker.index]
  let len = node.childNodes ? node.childNodes.length : 0
  for(let i = 0; i < len; i++){ // 深度遍历子节点
    let child = node.childNodes[i];
    walker.index++;
    dfsWalk(child, walker, patches);
  }
  if(currentPatches){
    applyPatches(node, currentPatches); // 对当前节点进行DOM操作
  }
}

function applyPathces(node, currentPatches){
  currentPatches.forEach(currentPatch => {
    switch (currentPatch.type) {
      case REPLACE:
        node.parentNode.replaceChild(currentPatch.node.render(), node)
        break;
      case REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        setProps(node, currentPatch.props)
        break
      case TEXT:
        node.textContent = currentPatch.content;
        break;
      default:
        break;
    }
  });
}