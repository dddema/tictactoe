document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('rstbtn');
    const turn = document.getElementById('turn-text');

    let currentPlayer = 'X';
    let gameOver = false;


    // Initialize the players turn text
    changePlayerText();

    // Initialize the game board
    const cells = Array.from(document.querySelectorAll('.cell'));
    let cellIndex = 0;
    cells.forEach(cell => {

        // cell.textContent = cellIndex;

        // Set the cell's border based on its position in the grid
        cell.style.borderRight = cellIndex % 3 !== 2 ? '2px solid black' : 'none';
        cell.style.borderBottom = cellIndex < 6 ? '2px solid black' : 'none';
        cellIndex++;

        cell.addEventListener('click', () => {
            if (!gameOver && !cell.textContent) {
                cell.textContent = currentPlayer;
                cell.style.color = getCurrentPlayerColor();
                if (findWinningCells() != null) {
                    gameEnded(0);
                } else if (checkDraw()) {
                    gameEnded(1);
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    changePlayerText();
                }
            }
        });
    });
    
    // Initialize the reset button
    resetBtn.addEventListener('click', () => {
        resetGame();
    });

    // Update the player's turn text
    function changePlayerText() {
        turn.textContent = 'Player\'s turn: ' + currentPlayer;
    }

    // Function to get the current player's color
    function getCurrentPlayerColor() {
        return currentPlayer === 'X' ? 'blue' : 'red';
    }

    // Function to check if a player has won
    function checkWin() {
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        return winningConditions.some(combination =>
            combination.every(index => cells[index].textContent === currentPlayer)
        );
    }

    // Function to find the winning cells
    function findWinningCells() {
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        return winningConditions.find(combination =>
            combination.every(index => cells[index].textContent === currentPlayer)
        );
    }

    // Function to check if it's a draw
    function checkDraw() {
        return cells.every(cell => cell.textContent);
    }

    // Function to make the cells unclickable after the game ends
    function unclickableCells() {
        cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
        });
    }
    // Function to draw the winning line on the canvas
    function drawWinningLine(winningCells) {
        const [index1, index2, index3] = winningCells;
        const cell1 = cells[index1];
        const cell3 = cells[index3];

        const x1 = cell1.offsetLeft + cell1.offsetWidth / 2;
        const y1 = cell1.offsetTop + cell1.offsetHeight / 2;
        const x3 = cell3.offsetLeft + cell3.offsetWidth / 2;
        const y3 = cell3.offsetTop + cell3.offsetHeight / 2;
        
        const canvas = document.getElementById('line-canvas');
        const context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x3, y3);
        context.lineWidth = 5;
        context.strokeStyle = getCurrentPlayerColor();
        context.closePath();
        context.stroke();
    }

    // Function that ends the game and displays the winner, the confetti and block the cells, via other functions
    function gameEnded(aftermath) {
        if (aftermath === 0) {
            turn.textContent = currentPlayer + ' wins!';
            drawWinningLine(findWinningCells());
            startAnimation();
        } else if (aftermath === 1) {
            turn.textContent = 'Its a Draw!';
        }
        gameOver = true;
        unclickableCells();
    }

    // Function to reset the game after it ends
    function resetGame() {
        cells.forEach(cell => {
            cell.textContent = null;
            cell.style.textColor = 'black';
        });

        cells.forEach(cell => {
            cell.style.pointerEvents = 'auto';
        });

        const canvas = document.getElementById('line-canvas');
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        gameOver = false;
        currentPlayer = 'X';
        changePlayerText();
        stopAnimation();
    }
});


