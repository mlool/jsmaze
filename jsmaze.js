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
    context.fillStyle = 'red';
    context.fillRect(x, y, gridDimension - 1, gridDimension - 1);
})

drawBoard();