export const createTree = async (userData: any, depthLevel: number = 0) => {
  class MyNode {
    public children: MyNode[] = [];
    public name: string;

    constructor(_name: string){
      this.name = _name;
    }

    public addChild(child: MyNode) {
      this.children.push(child);
    }

    public removeChild(child: MyNode) {
      const index = this.children.indexOf(child);
      if (index !== -1) {
        this.children.splice(index, 1);
      }
    }
  }

  function getDepth(node: MyNode, depth: number = 0): number {
    if (!node.children.length) {
      return depth;
    }

    let maxDepth = depth;
    for (const child of node.children) {
      const childDepth = getDepth(child, depth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }

    return maxDepth;
  }

  function getChildrenAtDepth(
    node: MyNode, targetDepth: number, currentDepth: number = 0
  ): MyNode[] {
    if (currentDepth === targetDepth) {
      return [node];
    }

    // @ts-ignore
    let childrenAtDepth: any = [];
    for (const child of node.children) {
      // @ts-ignore
      childrenAtDepth = childrenAtDepth.concat(
        getChildrenAtDepth(child, targetDepth, currentDepth + 1)
      );
    }

    return childrenAtDepth;
  }

  async function insertDataRecursive(nodeName: string, currentNode: MyNode) {
    // console.log("nodeName:", nodeName);
    if (!Object.keys(userData).length) return;

    for (const k in userData) {
      // @ts-ignore
      const v = userData[k];
      if(v[0] == nodeName && v.length == 1){
        //console.log(nodeName, v[0]);
        var ntmp = new MyNode(k);
        currentNode.addChild(ntmp);
        //@ts-ignore
        delete userData[k];
      }
      // else{
      //   for(var j=0; j< v.length; j++){
      //     //console.log(nodeName, j,  v[j]);
      //     if(v[j] == nodeName){
      //       //@ts-ignore
      //       userData[k].splice(j, 1);
      //     }
      //   }
      // }
    }

    for(var i =0; i<currentNode.children.length; i++){
      insertDataRecursive(currentNode.children[i].name, currentNode.children[i]);
    }
    return;
  }

  async function createRootNode(){
    const rootNode = new MyNode("root");
    return rootNode;
  }

  async function reduceTreeResolveKnowsWithWeights(rootNode: MyNode){
    function is_all_deps_loaded(v: any, v_map: any){
      for (var i=0; i<v.length;i++) {
        // console.log("is_all_deps_loaded:",v_map[v[i]], v[i], i);
        if(!v_map[v[i]]) return false;
      }
      return true;
    }

    function select_max_weighed_ones(v_map: any){
      let selected = [];
      let max_value = -1;
      //find max one
      for (var k in v_map){
        if (v_map.hasOwnProperty(k)) {
          if(max_value < v_map[k])
            max_value = v_map[k];
        }
      }

      for (var k in v_map){
        if (v_map.hasOwnProperty(k)) {
            if(v_map[k] == max_value)
              selected.push(k);
        }
      }
      return selected;
    }

    for (const k in userData) {
      let max_matched_depth = 0;
      let node_name = '';
      //@ts-ignore
      const v = userData[k];
      //@ts-ignore
      let v_map = [];
      for (var j=0; j< v.length; j++) {
        const totalDepth = getDepth(rootNode);
        for (var i=0; i< totalDepth; i++) {
          const childrens: any = getChildrenAtDepth(rootNode, i);
          for (var x=0; x < childrens.length; x++) {
            if (childrens[x].name == v[j]) {
              //@ts-ignore
              v_map[childrens[x].name] = i;
            }
          }
        }
      }
      //@ts-ignore
      if(is_all_deps_loaded(v, v_map)){
        //@ts-ignore
        const list_of_deps_deepest = select_max_weighed_ones(v_map);
        //set_deepest_as_the_needful_item(list_of_deps_deepest[0]);

        //@ts-ignore
        userData[k] = [list_of_deps_deepest[0]];
      }
    }
  }

  async function main() {
    let rootNode = await createRootNode();
    let max_depth = 100;

    Object.keys(userData).forEach(_pluginName => {
      if (!userData[_pluginName].length) {
        userData[_pluginName].push('root');
      }
    });

    while (max_depth > 0 && Object.keys(userData).length) {
      max_depth--;

      await insertDataRecursive("root", rootNode);
      await reduceTreeResolveKnowsWithWeights(rootNode);
    }

    if (max_depth <= 0) {
      console.log('unable to resolve plugin depth - giving up after 1000 depth');
      process.exit(-1);
    }

    return rootNode;
  }

  const node: any = await main();
  return await getChildrenAtDepth(node, depthLevel);
};
