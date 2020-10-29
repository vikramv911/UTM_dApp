/*  demo.js http://github.com/bgrins/javascript-astar
    MIT License

    Set up the demo page for the A* Search
*/
/* global Graph, astar, $ */

//const BigchainDB = require('bigchaindb-driver');

//const API_PATH = 'https://test.bigchaindb.com/api/v1/';
//const conn = new BigchainDB.Connection(API_PATH);

var WALL = 0,
    performance = window.performance;

var GRID = []; 
var curr_X, curr_Y;
var curr_ts, end_ts;

Mapping = {

    gridToXY: function(gridID,fl){

        var tempIndex = 1;
        for (var a = 0; a<fl; a++){
            for (var b = 0; b<fl; b++){
                // console.log(tempIndex);
                    if(tempIndex == gridID){
                        window.alert("Mapping " + a + " | " + b)
                        curr_X = a;
                        curr_Y = b;
                    }
                tempIndex++;
            }
        }
    }

};


App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {

    $.getJSON("UTM.json", function(utm) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.UTM = TruffleContract(utm);
      // Connect provider to interact with contract
      App.contracts.UTM.setProvider(App.web3Provider);

         // Load account data
        web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
            App.account = account;
            $("#accountAddress").html("Drone Registration ID: " + account);

        }
        });
        return App.initGrid();
    });
},
    
    initGrid: function() {
            //get pathWeight
        var fl = 40;
          App.contracts.UTM.deployed().then(function(instance) {
            gridInstance = instance;
            return gridInstance.gridCount();
            }).then(function(gridCount) {
                //window.alert(gridCount);
                for (var i = 1; i <= gridCount; i++) {
                    gridInstance.pathGrid(i).then(function(cell) {
                    var gridIndex = cell[0];
                    var weight = cell[1];
                        var tempIndex = 1;
                        if (gridIndex !=0) {
                            //window.alert("Path: " + gridIndex + " - " + weight);
                        for (var a = 0; a<fl; a++){
                            for (var b = 0; b<fl; b++){
                                 // console.log(tempIndex);
                                  if(tempIndex == gridIndex){
                                        GRID[a][b] = weight;
                                        }
                                        tempIndex++;
                                    }          }}
                    });
            }});
           return App.initNoGo();
        },

        initNoGo: function() {
            //initialise NoGo
          App.contracts.UTM.deployed().then(function(instance) {
            gridInstance = instance;
            return gridInstance.noGoCount();
            }).then(function(noGoCount) {
               // window.alert(noGoCount);
                for (var i = 1; i <= noGoCount; i++) {
                    gridInstance.noGo(i).then(function(cell) {
                    var gridIndex = cell[0];
                    var weight = cell[1];
                    var fl = cell[2];
                        var tempIndex = 1;
                      //  window.alert(gridIndex);
                       if (gridIndex !=0) {
                        for (var a = 0; a<fl; a++){
                            for (var b = 0; b<fl; b++){
                                  if(tempIndex == gridIndex){
                                      //window.alert("NOGO - " + tempIndex);
                                     GRID[a][b] = weight;
                                    }
                                    tempIndex++;
                                  }
                            }
                        }
                    });
            }});
        }

};


AppAddRemove = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return AppAddRemove.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      AppAddRemove.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      AppAddRemove.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(AppAddRemove.web3Provider);
    }
    return AppAddRemove.initContract();
  },

  initContract: function() {

    $.getJSON("UTM.json", function(utm) {
      // Instantiate a new truffle contract from the artifact
      AppAddRemove.contracts.UTM = TruffleContract(utm);
      // Connect provider to interact with contract
      AppAddRemove.contracts.UTM.setProvider(AppAddRemove.web3Provider);

         // Load account data
        web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
            AppAddRemove.account = account;
           // $("#accountAddress").html("Drone Registration ID: " + account);

                     AppAddRemove.contracts.UTM.deployed().then(function(instance) {
                    if (instance.dronesActive(0xDF4A7ca8AAAA520c502e9799749819BA588c5b11)) {
                        droneVal = 1;
                    }
                    else {
                        droneVal = 0;
                    }
                   console.log(instance.dronesActive(0xDF4A7ca8AAAA520c502e9799749819BA588c5b11) + " Drone Value Initial: " + droneVal); 
              }).catch(function(err) {
                  console.error(err);
                });

            //add drone to active list
            AppAddRemove.contracts.UTM.deployed().then(function(instance) {
                    gridInstance = instance;
                  return instance.addDrone(AppAddRemove.account);
              }).then(function(result){
                if (gridInstance.dronesActive(0xDF4A7ca8AAAA520c502e9799749819BA588c5b11)) {
                        droneVal = 1;
                    }
                    else {
                        droneVal = 0;
                    }
                   console.log("Drone Value Before: " + droneVal); 

              }).catch(function(err) {
                  console.error(err);
                }); 
        }
        });

        return AppAddRemove.removePath();
    });
},
            removePath: function(){
                //Read path weight
/*            App.contracts.UTM.deployed().then(function(instance) {
                  return instance.pathGrid(158).then(function(result) {
                  console.log("path 9: "+result[1]);
                });
              }); */

             // console.log(GRID[38][3]);

             //remove path weight
             AppAddRemove.contracts.UTM.deployed().then(function(instance) {
                  return instance.removePath(157,40,curr_ts);
              }).then(function(result) {
                  console.log("path deleted 157,40");
                  Mapping.gridToXY(157, 40);
                  GRID[curr_X][curr_Y] = 1;
                }).catch(function(err) {
                  console.error(err);
                });

                AppAddRemove.contracts.UTM.deployed().then(function(instance) {
                  return instance.removePath(158,40,curr_ts);
              }).then(function(result) {
                  console.log("path deleted 158,40");
                  Mapping.gridToXY(158, 40);
                  GRID[curr_X][curr_Y] = 1;
                }).catch(function(err) {
                  console.error(err);
                });


                  //remove drone from blacklist
             AppAddRemove.contracts.UTM.deployed().then(function(instance) {
                    gridInstance = instance;
                  return instance.removeDrone(AppAddRemove.account);
              }).then(function(result){
                if (gridInstance.dronesActive(0xDF4A7ca8AAAA520c502e9799749819BA588c5b11)) {
                        droneVal = 1;
                    }
                    else {
                        droneVal = 0;
                    }
                   console.log("Drone Value After: " + droneVal); 

              }).catch(function(err) {
                  console.error(err);
                }); 
    }
};

//main function
$(function() {

//initialise grid parameters & options from client 
    var $grid = $("#search_grid"),
        $selectWallFrequency = $("#selectWallFrequency"),
        $selectGridSize = $("#selectGridSize"),
        $checkDebug = $("#checkDebug"),
        $searchDiagonal = $("#searchDiagonal"),
        $checkClosest = $("#checkClosest");

    var opts = {
        wallFrequency: $selectWallFrequency.val(),
        gridSize: $selectGridSize.val(),
        debug: $checkDebug.is("checked"),
        diagonal: $searchDiagonal.is("checked"),
        closest: $checkClosest.is("checked")
    };

//Initialise Global variables , all weights on GRID to 1
    for (var i=0; i<40; i++){
         GRID[i] = [];
        for(var j=0;j<40;j++){
            GRID[i][j] = 1;
        }
    }
    curr_X = 1;
    curr_Y = 1;

    $(window).load(function() {
        App.init();
    });
       $("#search_grid").hide();
    //new graphsearch object
    var grid = new GraphSearch($grid, opts, astar.search);

    $("#btnGenerate").click(function() {
        grid.initialize();
        $("#search_grid").show();
    });

    $("#btnRefresh").click(function() {
        grid.initialize();
        $("#search_grid").show();
    });

    $("#btnComplete").click(function() {
        grid.initialize();
        $("#search_grid").show();
    });

    $selectWallFrequency.change(function() {
        grid.setOption({wallFrequency: $(this).val()});
        grid.initialize();
    });

    $selectGridSize.change(function() {
        grid.setOption({gridSize: $(this).val()});
        grid.initialize();
    });

    $checkDebug.change(function() {
        grid.setOption({debug: $(this).is(":checked")});
    });

    $searchDiagonal.change(function() {
        var val = $(this).is(":checked");
        grid.setOption({diagonal: val});
        grid.graph.diagonal = val;
    });

    $checkClosest.change(function() {
        grid.setOption({closest: $(this).is(":checked")});
    });

    $("#generateWeights").click(function () {
        if ($("#generateWeights").prop("checked")) {
            $('#weightsKey').slideDown();
        } else {
            $('#weightsKey').slideUp();
        }
    });

});

var css = { start: "start", finish: "finish", wall: "wall", active: "active" };

//on page load run
function GraphSearch($graph, options, implementation) {
    this.$graph = $graph;
    this.search = implementation;
    this.opts = $.extend({wallFrequency:0.1, debug:true, gridSize:10}, options);
    this.initialize();
}
GraphSearch.prototype.setOption = function(opt) {
    this.opts = $.extend(this.opts, opt);
    this.drawDebugInfo();
};
GraphSearch.prototype.initialize = function() {
    this.grid = [];
    var self = this,
        nodes = [],
        $graph = this.$graph;

    $graph.empty();


    var cellWidth = (($graph.width()-200)/this.opts.gridSize)-2,  // -2 for border , 50 for lane
        cellHeight = ($graph.height()/this.opts.gridSize)-2,
        $cellTemplate = $("<span />").addClass("grid_item").width(cellWidth).height(cellHeight),
        startSet = false;        
        
		//initialise entire grid
    for(var x = 0; x < this.opts.gridSize; x++) {
        var $row = $("<div class='clear' />"),
            nodeRow = [],
            gridRow = [];
            

        for(var y = 0; y < this.opts.gridSize; y++) {
            var id = "cell_"+x+"_"+y,
                $cell = $cellTemplate.clone();
            	$cell.attr("id", id).attr("x", x).attr("y", y);
            
            //lane
            if (y == (this.opts.gridSize/2)-1) {
            	var laneWidth = 200;
            	var laneWeight = Math.floor(Math.random() * 20)+10;
            	$cell.width(laneWidth);
            	
            	$row.append($cell);
            	gridRow.push($cell);
            	nodeRow.push(laneWeight);
            	$cell.addClass('lane');
            	$cell.html(laneWeight);	
            }
            else {
            
            $row.append($cell);
            gridRow.push($cell);
            
            var isWall = Math.floor(Math.random()*(1/self.opts.wallFrequency));
            isWall = 1;

            var wt = GRID[x][y];

            if(wt == 0) {
                nodeRow.push(WALL);
                $cell.addClass(css.wall);
            }
            else  {
                if (wt == 3) { 
                    nodeRow.push(wt);
                    $cell.addClass('weight' + wt);
                }
                else if (wt == 5) { 
                    nodeRow.push(wt);
                    $cell.addClass('weight' + wt);
                }
                else {
                    var cell_weight = ($("#generateWeights").prop("checked") ? (Math.floor(Math.random() * 3)) * 2 + 1 : 1);
                    nodeRow.push(cell_weight);
                    $cell.addClass('weight' + cell_weight);
                }
                
                if ($("#displayWeights").prop("checked")) {
                    $cell.html(cell_weight);
                }
                if (!startSet) {
                    $cell.addClass(css.start);
                    startSet = true;
                }
            }
            }
        // console.log(nodeRow);
        }
        $graph.append($row);
        this.grid.push(gridRow);
        nodes.push(nodeRow);
    }

    this.graph = new Graph(nodes);
    // bind cell event, set start/wall positions
    this.$cells = $graph.find(".grid_item");

    this.$cells.click(function() {
   		//window.alert(document.getElementById("startTime").value);
        var curr_time = new Date();
        curr_time = curr_time.getTime()/1000;
        var start_time = $('#startTime').timepicker('getTime').getTime()/1000; 
        var curr = new Date();
        curr_ts = curr.getHours()*60 + curr.getMinutes();      
        console.log("Time: " + (start_time - curr_time)/60);
        self.cellClicked($(this,nodes)); //run path finding algo
    });
    
}; 

GraphSearch.prototype.cellClicked = function($end,nodes) {

    var end = this.nodeFromElement($end);

    if($end.hasClass(css.wall) || $end.hasClass(css.start)) {
        return;
    }
    
    var $start = this.$cells.filter("." + css.start),
        start = this.nodeFromElement($start);

    var sTime = performance ? performance.now() : new Date().getTime();

    var path = this.search(this.graph, start, end, {
        closest: this.opts.closest
    });
    var fTime = performance ? performance.now() : new Date().getTime(),
        duration = (fTime-sTime).toFixed(2);

    if(path.length === 0) {
        $("#message").text("couldn't find a path (" + duration + "ms)");
        this.animateNoPath();
    }
    else {
    	var totalTime = 0;
        $("#message").text("search took " + duration + "ms.");
        $("#message_start").text("Home - "  + parseInt($start.attr("x")) + ":" + parseInt($start.attr("y")));
        $("#message_end").text("Destination - "  + parseInt($end.attr("x")) + ":" + parseInt($end.attr("y")));
        this.drawDebugInfo();       
       
		$end.addClass("finish");
		//console.log(this.graph.grid[0][19].weight);
		console.log("Path Length: " + path.length);
		this.updateWeights(path,1);
        this.animatePath(path,totalTime);
        AppAddRemove.init();
    }
};
GraphSearch.prototype.drawDebugInfo = function() {
    this.$cells.html(" ");
    var that = this;
    if(this.opts.debug) {
        that.$cells.each(function() {
            var node = that.nodeFromElement($(this)),
                debug = false;
            if (node.visited) {
                debug = "F: " + node.f + "<br />G: " + node.g + "<br />H: " + node.h;
            }

            if (debug) {
                $(this).html(debug);
            }
        });
    }
};
 
GraphSearch.prototype.updateWeights = function(path,addRemove) {
    
	var j = 0;
	  if (addRemove == 1) { 
 		for(var a = 0; a < this.opts.gridSize; a++) {
	   		for(var b = 0; b < this.opts.gridSize; b++) {
				if (j<path.length){
				if (path[j].x == a && path[j].y == b) {
                        console.log("PathX: " + a + " PathY: " + b + " Weight: " + this.graph.grid[a][b].weight);
	   				    this.graph.grid[a][b].weight += 1;
	   					console.log("A/R | Path cost " + addRemove + " | " + path[j].getCost());
                        //App.initPath(a,b,path[j].getCost());
	   					j++;
	   			}}
	   			}
	   }
	   } else if (addRemove == 0) {
	   		for(var a = 0; a < this.opts.gridSize; a++) {
	   		for(var b = 0; b < this.opts.gridSize; b++) {
				if (j<path.length){
				if (path[j].x == a && path[j].y == b) {
                        console.log("PathX: " + a + " PathY: " + b + " Weight: " + this.graph.grid[a][b].weight);
	   				    this.graph.grid[a][b].weight -= 1;
	   					console.log("A/R | Path cost " + addRemove + " | " + path[j].getCost());
	   					j++;
	   			}}
	   			}
	   }
	   }
};

GraphSearch.prototype.nodeFromElement = function($cell) {
    return this.graph.grid[parseInt($cell.attr("x"))][parseInt($cell.attr("y"))];
};
GraphSearch.prototype.animateNoPath = function() {
    var $graph = this.$graph;
    var jiggle = function(lim, i) {
        if(i>=lim) { $graph.css("top", 0).css("left", 0); return; }
        if(!i) i=0;
        i++;
        $graph.css("top", Math.random()*6).css("left", Math.random()*6);
        setTimeout(function() {
            jiggle(lim, i);
        }, 5);
    };
    jiggle(20); //jiggle time seconds
};

GraphSearch.prototype.animatePath = function(path,totalTime) {
    var grid = this.grid,
        timeout = 10000 / grid.length,
        elementFromNode = function(node) {
        return grid[node.x][node.y];
    };
	
    var self = this;
    // will add start class if final
    var removeClass = function(path, i) {
        if(i >= path.length) { // finished removing path, set start positions //< 0 for return
            return setStartClass(path, i); //path.length for return
        }
        elementFromNode(path[i]).removeClass(css.active);
        
        setTimeout(function() {
            removeClass(path, i+1); // -1 for return
        }, timeout*path[i].getCost());
    };
    var setStartClass = function(path, i) {
        if(i === path.length) {
            self.$graph.find("." + css.start).removeClass(css.start);
            elementFromNode(path[i-1]).addClass(css.start);
        }
         $("#time").text("Total Time - "  + (totalTime/600).toFixed(0) + "mins");
         
            var hm = document.getElementById("startTime").value;
                var hrs = Number(hm.split(":")[0]);
                var mins = Number(hm.split(":")[1]);
                var theFutureTime = moment().hour(hrs).minute(mins).add((totalTime/600).toFixed(0),'minutes').format("HH:mm");
                var theFuture_Hour = Number(theFutureTime.split(":")[0]);
                var theFuture_Minute = Number(theFutureTime.split(":")[1]);
                end_ts = theFuture_Hour*60 + theFuture_Minute;
                window.alert(end_ts + " - " + curr_ts); // use to transfer to BC

          $("#end_time").text("End Time - "  + theFutureTime);

        };
    var addClass = function(path, i) {
        if(i >= path.length) { // Finished showing path, now remove
            return removeClass(path, 0); //path.length-1 for return
        }
 
        elementFromNode(path[i]).addClass(css.active);
        totalTime += timeout*path[i].getCost();
    	//console.log(timeout*path[i].getCost());
        setTimeout(function() {
            addClass(path, i+1);
        }, timeout*path[i].getCost());
    };
	
    addClass(path, 0);
    //this.$graph.find("." + css.start).removeClass(css.start);x
        this.updateWeights(path,0);
    this.$graph.find("." + css.finish).removeClass(css.finish).addClass(css.start);
   
}
