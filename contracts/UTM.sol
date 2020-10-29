pragma solidity ^0.5.12;

contract UTM {
    // Model a Cell
    struct Cell {
        uint gridIndex; //single integer to index each cell on a grid
        uint weight; // cell weight
        uint fl; // Flight level
        uint end_time; //timestamp
    }

    // Store grid info
    mapping(uint => Cell) public noGo; //mapping of all NO-GO cells
    mapping(uint => Cell) public pathGrid; //mapping of all cells which currently have a path on it
    //Listof blacklisted drones admins
    mapping(address => bool) public dronesActive; //mapping of all drones which are currently having a filed path / flying


    // Store blackholes count
    uint public noGoCount;
    uint public gridCount;

    constructor () public {
        
        initialiseNoGo(1569,40);
        initialiseNoGo(14,40);
        initialiseNoGo(69,40);
        initialiseNoGo(67,40);
        initialiseNoGo(1521,40);
        initialiseNoGo(1409,40);
        initialiseNoGo(808,40);
        initialiseNoGo(132,40);
        initialiseNoGo(1057,40);
        initialiseNoGo(740,40);
        initialiseNoGo(633,40);
        initialiseNoGo(31,40);
        initialiseNoGo(871,40);
        initialiseNoGo(1451,40);
        initialiseNoGo(795,40);
        initialiseNoGo(1117,40);
        initialiseNoGo(61,40);
        initialiseNoGo(1320,40);
        initialiseNoGo(1520,40);
        initialiseNoGo(223,40);
        initialiseNoGo(428,40);
        initialiseNoGo(294,40);
        initialiseNoGo(167,40);
        initialiseNoGo(1581,40);
        initialiseNoGo(84,40);
        initialiseNoGo(163,40);
        initialiseNoGo(737,40);
        initialiseNoGo(982,40);
        initialiseNoGo(621,40);
        initialiseNoGo(1425,40);
        initialiseNoGo(1275,40);
        initialiseNoGo(821,40);
        initialiseNoGo(1049,40);
        initialiseNoGo(1337,40);
        initialiseNoGo(1347,40);
        initialiseNoGo(61,40);
        initialiseNoGo(1280,40);
        initialiseNoGo(1122,40);
        initialiseNoGo(1152,40);
        initialiseNoGo(31,40);
        initialiseNoGo(6,40);
        initialiseNoGo(1196,40);
        initialiseNoGo(69,40);
        initialiseNoGo(1483,40);
        initialiseNoGo(851,40);
        initialiseNoGo(307,40);
        initialiseNoGo(1189,40);
        initialiseNoGo(1243,40);
        initialiseNoGo(566,40);
        initialiseNoGo(916,40);
        initialiseNoGo(1450,40);
        initialiseNoGo(739,40);
        initialiseNoGo(549,40);
        initialiseNoGo(201,40);
        initialiseNoGo(338,40);
        initialiseNoGo(464,40);
        initialiseNoGo(126,40);
        initialiseNoGo(443,40);
        initialiseNoGo(29,40);
        initialiseNoGo(629,40);
        initialiseNoGo(988,40);
        initialiseNoGo(396,40);
        initialiseNoGo(186,40);
        initialiseNoGo(527,40);
        initialiseNoGo(195,40);
        initialiseNoGo(854,40);
        initialiseNoGo(175,40);
        initialiseNoGo(277,40);
        initialiseNoGo(1101,40);
        initialiseNoGo(623,40);
        initialiseNoGo(747,40);
        initialiseNoGo(1553,40);
        initialiseNoGo(239,40);
        initialiseNoGo(1437,40);
        initialiseNoGo(618,40);
        initialiseNoGo(1199,40);
        initialiseNoGo(1478,40);
        initialiseNoGo(749,40);
        initialiseNoGo(1462,40);
        initialiseNoGo(534,40);
        initialiseNoGo(373,40);
        initialiseNoGo(1570,40);
        initialiseNoGo(838,40);
        initialiseNoGo(231,40);
        initialiseNoGo(81,40);
        initialiseNoGo(997,40);
        initialiseNoGo(1271,40);
        initialiseNoGo(1329,40);
        initialiseNoGo(1332,40);
        initialiseNoGo(1398,40);
        initialiseNoGo(213,40);
        initialiseNoGo(206,40);
        initialiseNoGo(1064,40);
        initialiseNoGo(1473,40);
        initialiseNoGo(783,40);
        initialiseNoGo(1531,40);
        initialiseNoGo(1340,40);
        initialiseNoGo(537,40);
        initialiseNoGo(1362,40);
        initialiseNoGo(598,40);


      //  admin[0x930F61E88ddf5d392DCc1a6537ab4b3CE1ce30E7] = true; 

        gridCount = 1600;
        noGoCount = 1600;
     /*   addPath (157,40,1020);
        addPath (4,40,1020);
        addPath (42,40,1020);
        addPath (43,40,1020);
        addPath (82,40,1020);
        addPath (82,40,1020);
        addPath (83,40,1020);
        addPath (84,40,1020);
        addPath (159,40,1020);
        addPath (160,40,1020);
        addPath (161,40,1020);
        addPath (158,40,1020);*/

        //new path
    /*    addPath (41,40,1020);
        addPath (42,40,1020);
        addPath (43,40,1020);
        addPath (44,40,1020);
        addPath (45,40,1020);
        addPath (46,40,1020);
        addPath (47,40,1020);
        addPath (48,40,1020); */

        addPath (450,40,1020);
        addPath (451,40,1020);
        addPath (452,40,1020);
        addPath (453,40,1020);
        addPath (454,40,1020);
        addPath (455,40,1020);
        addPath (456,40,1020);

        //initialise the 10 drones Ethereum account ID to 0 
        addDrone(0xDF4A7ca8AAAA520c502e9799749819BA588c5b11);


    }

    function initialiseNoGo (uint _gridIndex, uint _fl) private {
        noGo[_gridIndex] = Cell(_gridIndex,0,_fl,0);
    }

    function addPath (uint _gridIndex, uint _fl, uint _ts) public {
        require (!dronesActive[msg.sender]);

        uint wt = pathGrid[_gridIndex].weight;

        if (wt==0) {
            pathGrid[_gridIndex] = Cell(_gridIndex,wt+3,_fl,_ts);
        }
        else {
            pathGrid[_gridIndex] = Cell(_gridIndex,wt+2,_fl,_ts);
        }
    }

    function removePath (uint _gridIndex, uint _fl, uint _ts) public {
    
    if (_ts > pathGrid[_gridIndex].end_time) {
        if (pathGrid[_gridIndex].weight > 1 && pathGrid[_gridIndex].fl == _fl) {
            pathGrid[_gridIndex].weight = pathGrid[_gridIndex].weight - 2;
            pathGrid[_gridIndex].end_time = 1;
        }
    }
    }
    
    function addTempNoGo(uint _gridIndex, uint _fl, uint _ts) public {
        noGo[_gridIndex] = Cell(_gridIndex,0,_fl,_ts);
    }
    
    function removeTempNoGo(uint _gridIndex, uint _fl, uint _ts) public {
        if (_ts > noGo[_gridIndex].end_time) {
        if (noGo[_gridIndex].weight == 0 && noGo[_gridIndex].fl == _fl) {
            noGo[_gridIndex].weight = 1;
        }}
    }

    function addDrone(address _droneID) public {
        dronesActive[_droneID] = true;
    }

    function removeDrone(address _droneID) public {
        dronesActive[_droneID] = false;
    }

}