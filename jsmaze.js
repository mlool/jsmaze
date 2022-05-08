var endSet = false;

var gridDimension = 25;
var canvasHeight = 600;
var canvasWidth = 600;

var canvas = document.getElementById('maze');
var context = canvas.getContext('2d');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function drawBoard(){
    context.lineWidth = 2;
    context.strokeStyle = "#ededed";
    for (var x = 0; x < canvasWidth; x += 25) {
        for (var y = 0; y < canvasHeight; y += 25) {
           context.strokeRect(x, y, 25, 25); 
        }
    }
}

// General uses
function printPath(path) {
    for (var i = 1; i < path.length; i++) {
        drawBox(path[i][1] * 25, path[i][0] * 25, 'lightgreen');
    }
}

function drawBox(x, y, color) {
    while (x % gridDimension != 0) {
        x = x - 1;
    }
    while (y % gridDimension != 0) {
        y = y - 1;
    }
    context.fillStyle = color;
    context.fillRect(x, y, gridDimension - 1, gridDimension - 1);
}






// Actual Maze Solver
var gridSize = canvasHeight / gridDimension;
var grid = [];

var start = {
    startSet: false,
    xPos: 0,
    yPos: 0
};

var end = {
    endSet: false,
    xPos: 0,
    yPos: 0
};

function findDistance(curr) {
    var yDiff = (end.yPos / 25) - curr[0];
    var xDiff = (end.xPos / 25) - curr[1];
    return (yDiff * yDiff) + (xDiff * xDiff);
}

// validDirection: [North, East, South, West] as boolean
function directionToGo(currentLocation, validDirection) {
    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;

    var distanceIfGoNorth = findDistance([dft - 1, dfl]);
    var distanceIfGoSouth = findDistance([dft + 1, dfl]);
    var distanceIfGoEast = findDistance([dft, dfl + 1]);
    var distanceIfGoWest = findDistance([dft, dfl - 1]);

    var shortestDistance = 99999999999;
    if (validDirection[0]) shortestDistance = Math.min(shortestDistance, distanceIfGoNorth);
    if (validDirection[1]) shortestDistance = Math.min(shortestDistance, distanceIfGoEast);
    if (validDirection[2]) shortestDistance = Math.min(shortestDistance, distanceIfGoSouth);
    if (validDirection[3]) shortestDistance = Math.min(shortestDistance, distanceIfGoWest);


    if (distanceIfGoNorth == shortestDistance && validDirection[0]) return "North";
    if (distanceIfGoSouth == shortestDistance && validDirection[2]) return "South";
    if (distanceIfGoEast == shortestDistance && validDirection[1]) return "East";
    if (distanceIfGoWest == shortestDistance && validDirection[3]) return "West";
}

function isWall(x, y) {
    return (context.getImageData(x, y, 1, 1).data[0] == 255);
} 

async function gridSetup() {
    for (var i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (var j = 0; j < gridSize; j++) {
            if (j == start.xPos / 25 && i == start.yPos / 25) {
                console.log("start position: " + j + " " + i);
                grid[i][j] = 'Start';
            } else if (j == end.xPos / 25 && i == end.yPos / 25) {
                console.log("end position: " + j + " " + i);
                grid[i][j] = 'Goal';
            } else if (isWall(j * 25, i * 25)) {
                grid[i][j] = 'Obstacle';
            } else {
                grid[i][j] = 'Empty';
            }
        }
    }
}

async function mazeSolveInitialize(pathFindingChoice) {
    if (!start.startSet) {
        alert("use blue color to signal start position");
    } else if (!end.endSet) {
        alert("use green color to signal end position");
    } else {
        await gridSetup();
        if (pathFindingChoice == 'simple') {
            const result = await findShortestPathSimple([start.yPos / 25, start.xPos / 25], grid);
            printPath(result);
        } else if (pathFindingChoice == 'AStar') {
            const result = await findShortestPathAStar([start.yPos / 25, start.xPos / 25], grid);
            printPath(result);
        }
        
    }
}

async function findShortestPathSimple(startCoordinates, grid) {
    var distanceFromTop = startCoordinates[0];
    var distanceFromLeft = startCoordinates[1];

    var location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        distanceToEnd: 0,
        status: 'Start'
    };

    var queue = [location];

    while (queue.length > 0) {
        var currentLocation = queue.shift();
        await sleep(50);

        var newLocation = await exploreInDirection(currentLocation, 'East', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            drawBox(newLocation.distanceFromLeft * 25, newLocation.distanceFromTop * 25, 'rgb(212, 253, 212)');
            queue.push(newLocation);
        }

        var newLocation = await exploreInDirection(currentLocation, 'South', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            drawBox(newLocation.distanceFromLeft * 25, newLocation.distanceFromTop * 25, 'rgb(212, 253, 212)');
            queue.push(newLocation);
        }

        var newLocation = await exploreInDirection(currentLocation, 'West', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            drawBox(newLocation.distanceFromLeft * 25, newLocation.distanceFromTop * 25, 'rgb(212, 253, 212)');
            queue.push(newLocation);
        }

        var newLocation = await exploreInDirection(currentLocation, 'North', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            drawBox(newLocation.distanceFromLeft * 25, newLocation.distanceFromTop * 25, 'rgb(212, 253, 212)');
            queue.push(newLocation);
        }
    }

    return false;
};

// async function findShortestPathAStar(startCoordinates, grid) {
//     var distanceFromTop = startCoordinates[0];
//     var distanceFromLeft = startCoordinates[1];

//     var location = {
//         distanceFromTop: distanceFromTop,
//         distanceFromLeft: distanceFromLeft,
//         path: [],
//         distanceToEnd: 0,
//         status: 'Start'
//     };

//     location.distanceToEnd = findDistance(location);

//     var queue = [location];

//     while (queue.length > 0) {
//         var currentLocation = getMinimumDistance(queue);
//         await sleep(50);
        

//         var validDirections = [true, true, true, true]
//         var cycle = 0;

//         while (cycle < 4) {
//             var direction = directionToGo(currentLocation, validDirections);
//             var newLocation = exploreInDirection(currentLocation, direction, grid);
//             if (newLocation.status === 'Goal') {
//                 return newLocation.path;
//             } else if (newLocation.status === 'Valid') {
//                 drawBox(newLocation.distanceFromLeft * 25, newLocation.distanceFromTop * 25, 'rgb(212, 253, 212)');
//                 queue.push(newLocation);
//                 break;
//             }
//             cycle++;
//             if (direction == 'North') validDirections[0] = false;
//             if (direction == 'East') validDirections[1] = false;
//             if (direction == 'South') validDirections[2] = false;
//             if (direction == 'West') validDirections[3] = false;
//         }
//     }

//     return false;
// };

async function findDistanceWithLocation(location) {
    var yDiff = (end.yPos / 25) - location.distanceFromTop;
    var xDiff = (end.xPos / 25) - location.distanceFromLeft;
    return (yDiff * yDiff) + (xDiff * xDiff);
}

async function getMinimumDistance(queue) {
    var indexOfMinimum = 0;
    for (var i = 0; i < queue.length; i++) {
        if (queue[indexOfMinimum].distanceToEnd > queue[i].distanceToEnd) {
            indexOfMinimum = i;
        }
    }
    var result = queue[indexOfMinimum];
    queue.splice(indexOfMinimum, 1);
    return result;
}

async function findShortestPathAStar(startCoordinates, grid) {
    var distanceFromTop = startCoordinates[0];
    var distanceFromLeft = startCoordinates[1];

    var location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        distanceToEnd: 0,
        status: 'Start'
    };

    location.distanceToEnd = await findDistanceWithLocation(location);

    var queue = [location];

    while (queue.length > 0) {
        var currentLocation = await getMinimumDistance(queue);
        console.log(currentLocation.distanceToEnd);
        await sleep(50);
        
        if (currentLocation.status != 'Start') drawBox(currentLocation.distanceFromLeft * 25, currentLocation.distanceFromTop * 25, 'rgb(212, 253, 212)');
        
        var newLocation = await exploreInDirection(currentLocation, 'East', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            drawBox(newLocation.distanceFromLeft * 25, newLocation.distanceFromTop * 25, 'rgb(212, 253, 212)');
            queue.push(newLocation);
        }

        var newLocation = await exploreInDirection(currentLocation, 'South', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            drawBox(newLocation.distanceFromLeft * 25, newLocation.distanceFromTop * 25, 'rgb(212, 253, 212)');
            queue.push(newLocation);
        }

        var newLocation = await exploreInDirection(currentLocation, 'West', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            drawBox(newLocation.distanceFromLeft * 25, newLocation.distanceFromTop * 25, 'rgb(212, 253, 212)');
            queue.push(newLocation);
        }

        var newLocation = await exploreInDirection(currentLocation, 'North', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            drawBox(newLocation.distanceFromLeft * 25, newLocation.distanceFromTop * 25, 'rgb(212, 253, 212)');
            queue.push(newLocation);
        }

        console.log(queue.length);
    }

    return false;
};




  
async function locationStatus(location, grid) {
    var gridSize = grid.length;
    var dft = location.distanceFromTop;
    var dfl = location.distanceFromLeft;

    if (location.distanceFromLeft < 0 || location.distanceFromLeft >= gridSize || location.distanceFromTop < 0 || location.distanceFromTop >= gridSize) {
        return 'Invalid';
    } else if (grid[dft][dfl] === 'Goal') {
        return 'Goal';
    } else if (grid[dft][dfl] !== 'Empty') {
        return 'Blocked';
    } else {
        return 'Valid';
    }
};
  
async function exploreInDirection(currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push([currentLocation.distanceFromTop, currentLocation.distanceFromLeft]);
  
    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;
  
    if (direction === 'North') {
      dft -= 1;
    } else if (direction === 'East') {
      dfl += 1;
    } else if (direction === 'South') {
      dft += 1;
    } else if (direction === 'West') {
      dfl -= 1;
    }
  
    var newLocation = {
      distanceFromTop: dft,
      distanceFromLeft: dfl,
      path: newPath,
      distanceToEnd: 0,
      status: 'Unknown'
    };
    newLocation.status = await locationStatus(newLocation, grid);
    newLocation.distanceToEnd = await findDistanceWithLocation(newLocation);

    if (newLocation.status === 'Valid') {
      grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
    }
  
    return newLocation;
};




































canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    let x = Math.round(e.clientX - rect.left);
    let y = Math.round(e.clientY - rect.top);
    console.log("x: " + x + " y: " + y);
    while (x % gridDimension != 0) {
        x = x - 1;
    }
    while (y % gridDimension != 0) {
        y = y - 1;
    }
    console.log("x: " + x + " y: " + y);
    context.fillStyle = document.querySelector('.selected').classList[0];

    if (document.querySelector('.selected').classList[0] == "blue") {
        if (start.startSet) {
            alert('only one start possible');
            return;
        } else {
            start.startSet = true;
            start.xPos = x;
            start.yPos = y;
            if (context.getImageData(x, y, 1, 1).data[1] == 128) {
                end.endSet = false;
            }
        }
    } else if (document.querySelector('.selected').classList[0] == "green") {
        if (end.endSet) {
            alert('only one end possible');
            return;
        } else {
            end.endSet = true;
            end.xPos = x;
            end.yPos = y;
            if (context.getImageData(x, y, 1, 1).data[2] == 255) {
                start.startSet = false;
            }
        }
    } else {
        if (context.getImageData(x, y, 1, 1).data[1] == 128) {
            end.endSet = false;
        } else if (context.getImageData(x, y, 1, 1).data[2] == 255) {
            start.startSet = false;
        }
    }

    console.log(isWall(x, y));
    context.fillRect(x, y, gridDimension - 1, gridDimension - 1);
})

var matches = document.querySelectorAll('li');
matches.forEach((item) => {
    item.addEventListener('click', function() {
        document.querySelector('.selected').classList.remove('selected');
        item.classList.add('selected')
    });
});

var simpleStartButton = document.getElementById('simple-start');
simpleStartButton.addEventListener('click', function() {
    mazeSolveInitialize('simple');
})

var simpleStartButton = document.getElementById('astar-start');
simpleStartButton.addEventListener('click', function() {
    mazeSolveInitialize('AStar');
})

var clearBoardButton = document.getElementById('clear-board');
clearBoardButton.addEventListener('click', function() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    start.startSet = false;
    end.endSet = false;
    drawBoard();
})

drawBoard();
