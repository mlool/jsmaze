var endSet = false;

var gridDimension = 25;
var canvasHeight = 600;
var canvasWidth = 600;

var canvas = document.getElementById('maze');
var context = canvas.getContext('2d');

function drawBoard(){
    context.lineWidth = 2;
    context.strokeStyle = "#ededed";
    for (var x = 0; x < canvasWidth; x += 25) {
        for (var y = 0; y < canvasHeight; y += 25) {
           context.strokeRect(x, y, 25, 25); 
        }
    }
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

function drawBox(x, y) {
    while (x % gridDimension != 0) {
        x = x - 1;
    }
    while (y % gridDimension != 0) {
        y = y - 1;
    }
    context.fillStyle = 'lightgreen';
    context.fillRect(x, y, gridDimension - 1, gridDimension - 1);
}

function isWall(x, y) {
    return (context.getImageData(x, y, 1, 1).data[0] == 255);
} 

function mazeSolveInitialize() {
    if (!start.startSet) {
        alert("use blue color to signal start position");
    } else if (!end.endSet) {
        alert("use green color to signal end position");
    } else {
        for (var i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (var j = 0; j < gridSize; j++) {
                if (i == start.xPos && j == start.yPos) {
                    grid[i][i] = 'Start';
                } else if (i == end.xPos && j == end.yPos) {
                    grid[i][j] = 'Goal';
                } else if (isWall(i, j)) {
                    grid[i][j] = 'Obstacle';
                } else {
                    grid[i][j] = 'Empty';
                }
            }
        }
        console.log(findShortestPath([0,0], grid));
    }
}

function inBound(x, y) {
    return (x >= 0 && y >= 0 && x < canvasWidth && y < canvasHeight);
}

















var findShortestPath = function(startCoordinates, grid) {
    var distanceFromTop = start.xPos;
    var distanceFromLeft = start.yPos;

    var location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        status: 'Start'
    };

    // Initialize the queue with the start location already inside
    var queue = [location];

    // Loop through the grid searching for the goal
    while (queue.length > 0) {
        // Take the first location off the queue
        var currentLocation = queue.shift();

        // Explore North
        var newLocation = exploreInDirection(currentLocation, 'North', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore East
        var newLocation = exploreInDirection(currentLocation, 'East', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore South
        var newLocation = exploreInDirection(currentLocation, 'South', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore West
        var newLocation = exploreInDirection(currentLocation, 'West', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }
    }

    return false;
};
  
var locationStatus = function(location, grid) {
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
  
var exploreInDirection = function(currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);
  
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
      status: 'Unknown'
    };
    newLocation.status = locationStatus(newLocation, grid);

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

var startButton = document.getElementById('start');
startButton.addEventListener('click', function() {
    console.log('hello');
    mazeSolveInitialize();
})

drawBoard();
