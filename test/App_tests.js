
test( "Sanity Checks", function() {
  ok (typeof Graph !== "undefined", "Graph exists");
  ok (typeof astar !== "undefined", "Astar exists");
});

test( "Basic Horizontal", function() {

  var result1 = runSearch([[1],[1]], [0,0], [1,0]);
  equal (result1.text, "(1,0)", "One step down");

  var result2 = runSearch([[1],[1],[1]], [0,0], [2,0]);
  equal (result2.text, "(1,0)(2,0)", "Two steps down");

  var result3 = runSearch([[1],[1],[1],[1]], [0,0], [3,0]);
  equal (result3.text, "(1,0)(2,0)(3,0)", "Three steps down");

});

test( "Basic Vertical", function() {

  var result1 = runSearch([[1, 1]], [0,0], [0,1]);
  equal (result1.text, "(0,1)", "One step across");

  var result2 = runSearch([[1, 1, 1]], [0,0], [0,2]);
  equal (result2.text, "(0,1)(0,2)", "Two steps across");

  var result3 = runSearch([[1, 1, 1, 1]], [0,0], [0,3]);
  equal (result3.text, "(0,1)(0,2)(0,3)", "Three steps across");

});

test( "Basic Weighting", function() {

  var result1 = runSearch([[1, 1],
                           [2, 1]], [0,0], [1,1]);
  equal (result1.text, "(0,1)(1,1)", "Takes less weighted path");

  var result2 = runSearch([[1, 2],
                           [1, 1]], [0,0], [1,1]);
  equal (result2.text, "(1,0)(1,1)", "Takes less weighted path");

});

test( "Pathfinding", function() {
  var result1 = runSearch([
      [1,1,1,1],
      [0,1,1,0],
      [0,0,1,1]
  ], [0,0], [2,3]);

  equal (result1.text, "(0,1)(1,1)(1,2)(2,2)(2,3)", "Result is expected");
});

test( "Diagonal Pathfinding", function() {
  var result1 = runSearch(new Graph([
      [1,1,1,1],
      [0,1,1,0],
      [0,0,1,1]
  ], { diagonal: true}), [0,0], [2,3]);

  equal (result1.text, "(1,1)(2,2)(2,3)", "Result is expected");
});

test( "Multiple runs on the same graph", function() {
  var graph = new Graph([
      [1,1,0,1],
      [0,1,1,0],
      [0,0,1,1]
  ]);

  var result1 = runSearch(graph, [0,0], [2,3]);
  equal (result1.text, "(0,1)(1,1)(1,2)(2,2)(2,3)", "Result is expected");

  var result2 = runSearch(graph, [2,3], [0,0]);
  equal (result2.text, "(2,2)(1,2)(1,1)(0,1)(0,0)", "Result is expected");

});

function runSearch(graph, start, end, options) {
  if (!(graph instanceof Graph)) {
    graph = new Graph(graph);
  }
  start = graph.grid[start[0]][start[1]];
  end = graph.grid[end[0]][end[1]];
  var sTime = new Date(),
    result = astar.search(graph, start, end, options),
    eTime = new Date();
  return {
    result: result,
    text: pathToString(result),
    time: (eTime - sTime)
  };
}

function pathToString(result) {
  return result.map(function(node) {
    return "(" + node.x + "," + node.y + ")";
  }).join("");
}