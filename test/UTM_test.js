
var UTM = artifacts.require("./UTM.sol");


  it("Permanent NoGo's has been initialised in the right cells", function() {
    return UTM.deployed().then(function(instance) {
      UTMInstance = instance;
      return UTMInstance.noGo(132);
    }).then(function(cell) {
      assert.equal(cell[0], 132, "contains the correct index");
      assert.equal(cell[1], 0, "contains the correct weight");      
      assert.equal(cell[2], 40, "contains the correct flight level");
      assert.equal(cell[3], 0, "contains the correct end time");      
      return UTMInstance.noGo(1122);
    }).then(function(cell) {
      assert.equal(cell[0], 1122, "contains the correct index");
      assert.equal(cell[1], 0, "contains the correct weight");      
      assert.equal(cell[2], 40, "contains the correct flight level");
      assert.equal(cell[3], 0, "contains the correct end time"); 
    });
  });

  it("Added Paths: Cells colours are visible on grid and show the accurately increased weights at the correct cell locations ", function() {
    return UTM.deployed().then(function(instance) {
      UTMInstance = instance;
      return UTMInstance.pathGrid(42);
    }).then(function(cell) {
      assert.equal(cell[0], 42, "contains the correct index");
      assert.equal(cell[1], 3, "contains the correct weight");      
      assert.equal(cell[2], 40, "contains the correct flight level");
      assert.equal(cell[3], 1020, "contains the correct end time");      
      return UTMInstance.pathGrid(82);
    }).then(function(cell) {
      assert.equal(cell[0], 82, "contains the correct index");
      assert.equal(cell[1], 5, "contains the correct weight");      
      assert.equal(cell[2], 40, "contains the correct flight level");
      assert.equal(cell[3], 1020, "contains the correct end time"); 
    });
  });

      it("Inactive Drones are tagged as free on the distributed ledger", function() {
    return UTM.deployed().then(function(instance) {
      UTMInstance = instance;
      return UTMInstance.dronesActive("0xDF4A7ca8AAAA520c502e9799749819BA588c5b11");
    }).then(function(drone) {
      assert.equal(drone, true, "contains the correct status");
    });
  });

  it("Active Drones are tagged as blocked on the distributed ledger", function() {
    return UTM.deployed().then(function(instance) {
      UTMInstance = instance;
      UTMInstance.removeDrone("0xDF4A7ca8AAAA520c502e9799749819BA588c5b11");
      return UTMInstance.dronesActive("0xDF4A7ca8AAAA520c502e9799749819BA588c5b11");
    }).then(function(drone) {
      assert.equal(drone,false, "contains the correct status");
    });
  });


  it("Completed Paths: Cells colours are visible and weights are accurately reduced at the appropriate cell locations", function() {
    return UTM.deployed().then(function(instance) {
      UTMInstance = instance;
      UTMInstance.removePath(42,40,1200);
      UTMInstance.removePath(82,40,1200);
      return UTMInstance.pathGrid(42);
    }).then(function(cell) {
      assert.equal(cell[0], 42, "contains the correct index");
      assert.equal(cell[1], 1, "contains the correct weight");      
      assert.equal(cell[2], 40, "contains the correct flight level");
      assert.equal(cell[3], 1, "contains the correct end time");      
      return UTMInstance.pathGrid(82);
    }).then(function(cell) {
      assert.equal(cell[0], 82, "contains the correct index");
      assert.equal(cell[1], 3, "contains the correct weight");      
      assert.equal(cell[2], 40, "contains the correct flight level");
      assert.equal(cell[3], 1, "contains the correct end time"); 
    });
  });

  it("Active Drones are unable to file a new path until completion", function() {
    return UTM.deployed().then(function(instance) {
      UTMInstance = instance;
      UTMInstance.addDrone("0xfC570660FcAC67AA50Bb32C09134EdAaf35D825d");
      return UTMInstance.dronesActive("0xDF4A7ca8AAAA520c502e9799749819BA588c5b11");
    }).then(function(drone) {
      assert.equal(drone, true, "contains the correct status");
      //try to file new path again
      return UTMInstance.addPath(161,40,1020);
    }).then (assert.fail).catch(function(error) {
      assert(error.message.indexOf(' ') >= 0, "error message must contain ");
    return UTMInstance.pathGrid(161);
    }).then(function(cell) {
      assert.equal(cell[0], 161, "contains the correct index");
      assert.equal(cell[1], 3, "contains the correct weight");      
    });
  });

    it("Incomplete Paths: Cells colours are visible and weights are not reduced before filed end time ", function() {
    return UTM.deployed().then(function(instance) {
      UTMInstance = instance;
      UTMInstance.addPath(90,40,1020);
      UTMInstance.removePath(90,40,1000);
      return UTMInstance.pathGrid(90);
    }).then(function(cell) {
      assert.equal(cell[0], 90, "contains the correct index");
      assert.equal(cell[1], 3, "contains the correct weight");      
      assert.equal(cell[2], 40, "contains the correct flight level");
      assert.equal(cell[3], 1020, "contains the correct end time");      
    })
  });

/* */