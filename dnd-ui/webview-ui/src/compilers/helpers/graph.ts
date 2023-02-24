// This is a helper class
// input is a list of nodes and edges

export class Graph {

  nodes: {
    [id: string]: {
      id: string;
      type: string;
      // data?: any;
      // position?: any;
      // inPorts?: any;
      // outPorts?: any;
      // description?: any;
      // componentNames?: any;
      // outputQ?: any;
    }
  };

  // edges is an dictionary of objects with id is key and value is object with sourceHandle, target, targetHandle
  edges: {
    [id: string]: {
      source: string;
      sourceHandle: string;
      target: string;
      targetHandle: string;
    }
  }

  constructor(nodes: any, edges: any) {
    this.nodes = nodes;
    this.edges = edges;
  }




  // get root node of the graph
  // by default, the root node is the first node with type = 'visitNode'
  // if there is no node with type = 'visitNode', then the root node is the first node
  // if there is no node, then return undefined
  getRootNode() {
    let rootNode: any;
    for (const node of Object.values(this.nodes)) {
      if (node.type === 'visitNode') {
        rootNode = node;
        break;
      }
    }
    if (!rootNode) {
      rootNode = Object.values(this.nodes)[0];
    }
    return rootNode;
  }

  // find edges with source id
  // each node has multiple edges
  // return all edges with source id
  findEdgesWithSourceId(sourceId: string, allEdges: any = Object.values(this.edges)) {
    const matchedEdges = [];
    for (const currentEdge of allEdges) {
    if (currentEdge.source === sourceId) {
        matchedEdges.push(currentEdge);
      }
    }
    return matchedEdges;
  }



  // build paths from root node to leaf node
  // return an array of paths
  // each path is an array of nodes
  // for example, there is 2 following paths:
  // 1 -> 2 -> 3
  // 1 -> 4 -> 5
  // then the return value is:
  // [
  //   [1, 2, 3],
  //   [1, 4, 5],
  // ]

  buildPaths() : any[][] {
    // start with current node = root node
    let currentNode = this.getRootNode();
    let paths: any[][] = [];
    let processingPaths: any[][] = [];
    let currentPath = [currentNode];

    // Example edges
    // [1, 2], [2, 3], [1, 4], [4, 5]
    // clone edges to edgesClone
    let edgesClone = Object.values(this.edges);

    // init processingPaths with edges with source = root node
    let sourceEdges = this.findEdgesWithSourceId(currentNode.id)
    // return [[currentNode]] if there is no edge
    if (sourceEdges.length === 0) { return [[currentNode]]; }
    // processingPaths = [[1, 2], [1, 4]]
    processingPaths = sourceEdges.map(edge => [edge.source, edge.target]);

    // remove edges from clone edges with source = root node
    // edgesClone = [[2, 3], [4, 5]]
    edgesClone = edgesClone.filter(edge => edge.source !== currentNode.id);

    // init nextProcessingPaths = []
    let nextProcessingPaths: any[][] = [];
    // loop through processingPaths
    // current processingPaths has 2 values: [1, 2] and [1, 4]
    // for each path, find edges in edgesClone with source = last node of path
    // if there is no edge, then this path is a leaf path. add this path to paths
    // if there are edges, then for each edge, do:
    // - create a new path by clone current path and add this edge target as latest node.
    // - remove this edge from edgesClone
    // - add this new path to nextProcessingPaths

    // stop and return when nextProcessingPaths is empty
    do {
      nextProcessingPaths = [];

      processingPaths.forEach((path, index) => {
        let lastNode = path[path.length - 1];
        let edges = this.findEdgesWithSourceId(lastNode, edgesClone);

        if (edges.length === 0) {
          paths.push(path);
        }
        else {
          edges.forEach(edge => {
            let newPath = [...path, edge.target];
            nextProcessingPaths.push(newPath);
          });
        }
      })

      processingPaths = nextProcessingPaths;
    }
    while(nextProcessingPaths.length > 0)

    return paths;
  }

  // test function to test buildPaths with a graph with 2 paths and 5 nodes
  testBuildPaths() {
    const nodes = {
      1: {
        id: '1',
        type: 'visitNode',
      },
      2: {
        id: '2',
        type: 'buttonNode',
      },
      3: {
        id: '3',
        type: 'buttonNode',
      },
      4: {
        id: '4',
        type: 'buttonNode',
      },
      5: {
        id: '5',
        type: 'buttonNode',
      },
    };
    // edges connect nodes by 2 following paths:
    // 1 -> 2 -> 3
    // 1 -> 2 -> 4 -> 5
    const edges = {
      1: {
        source: '1',
        sourceHandle: 'out',
        target: '2',
        targetHandle: 'in',
      },
      2: {
        source: '2',
        sourceHandle: 'out',
        target: '3',
        targetHandle: 'in',
      },
      3: {
        source: '2',
        sourceHandle: 'out',
        target: '4',
        targetHandle: 'in',
      },
      4: {
        source: '4',
        sourceHandle: 'out',
        target: '5',
        targetHandle: 'in',
      },
    };


    const graph = new Graph(nodes, edges);
    const paths = graph.buildPaths();
    console.log(paths);
  }



}

// make Graph class available in window object for testing
(window as any).Graph = Graph;
console.log(" HELLO HERE")
