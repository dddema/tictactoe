document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('resetbtn');
    const turnText = document.getElementById('turn-text');
    const cells = Array.from(document.querySelectorAll('.cell'));
    const gameStats = Array.from(document.querySelectorAll('.game-stats-item'));
    
    let currentPlayer = 'X';
    let gameOver = false;   
    
    let gameCount = 0;
    let xWins = 0;
    let oWins = 0;
    let draws = 0;
    
    // Initialize the game board
    function initGame(){
        initStrings();

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
                        gameWon();
                    } else if (checkDraw()) {
                        gameDraw();
                    } else {
                        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                        changePlayerText();
                    }
                }
            });
        });
    }

    // Initialize the reset button
    resetBtn.addEventListener('click', () => {
        resetGame();
    });

    function initStrings(){
        // Initialize the players turn text
        changePlayerText();

        // Initialiaze game stats text
        updateGameStats();
    }

    // Update game stats text
    function updateGameStats() {
        updateLocalCookie();
        gameStats[0].textContent = gameCount;
        gameStats[1].textContent = xWins;
        gameStats[2].textContent = oWins;
        gameStats[3].textContent = draws;
    }
    
    // Update the player's turn text
    function changePlayerText() {
        turnText.textContent = 'Player\'s turn: ' + currentPlayer;
    }

    // Function to get the current player's color
    function getCurrentPlayerColor() {
        return currentPlayer === 'X' ? 'blue' : 'red';
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

    // Event Handler function for line resizing
    function redrawLine() {
        drawWinningLine(findWinningCells());
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
        context.lineWidth = '2vh';
        context.strokeStyle = getCurrentPlayerColor();
        context.closePath();
        context.stroke();
    }
    // get the cookie values for the game stats
    function updateLocalCookie() {
        const cookie = document.cookie;
        const cookieArray = cookie.split(';');
        const cookieObj = {};
        cookieArray.forEach(entry => {
            let [key, value] = entry.split('=');
            cookieObj[key.trim()] = value;
        });

        gameCount = parseInt(cookieObj.gameCount) || 0;
        xWins = parseInt(cookieObj.xWins) || 0;
        oWins = parseInt(cookieObj.oWins) || 0;
        draws = parseInt(cookieObj.draws) || 0;
    }

    // Function to create a cookie 
    function updateCookieStats() {
        document.cookie = `gameCount=${gameCount}; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
        document.cookie = `xWins=${xWins}; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
        document.cookie = `oWins=${oWins}; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
        document.cookie = `draws=${draws}; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
    }

    // Ending function for when a player wins, it also draws the winning line and starts the confetti animation 
    function gameWon(){
        turnText.textContent = currentPlayer + ' wins!';
        if (currentPlayer === 'X')
            xWins++;
        else
            oWins++;
        drawWinningLine(findWinningCells());
        // add event listener to redraw the line if the window get resized
        window.addEventListener('resize', redrawLine);

        startAnimation();
        gameEnd();
    }

    // Ending function for when a draw happens
    function gameDraw(){
        turnText.textContent = 'Its a Draw!';
        draws++;
        gameEnd();
    }

    // Function that ends the game, updating cookies, stats and making the cells unclickable
    function gameEnd() {   
        gameCount++;
        updateCookieStats();
        updateGameStats();
        unclickableCells();
        gameOver = true;
    }

    // Function to reset the game after it ends
    function resetGame() {
        // Resets the cells to empty and makes them clickable
        cells.forEach(cell => {
            cell.textContent = null;
            cell.style.textColor = 'black';
            cell.style.pointerEvents = 'auto';
        });

        // clears the line drawn on the canvas after a win
        const canvas = document.getElementById('line-canvas');
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        // remove event listener for the window resize
        window.removeEventListener('resize', redrawLine);


        gameOver = false;
        currentPlayer = 'X';
        changePlayerText();
        stopAnimation();
    }
    initGame();
});