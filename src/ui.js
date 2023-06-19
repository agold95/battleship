import Game from "./game";

export default function GameController() {
    const game = Game();

    // ui containers rendered to DOM
    const playerOneBoardUI = document.querySelector("#player-one-board");
    const playerTwoBoardUI = document.querySelector("#player-two-board");
    const newGamePopup = document.querySelector("#new-game-popup");
    const boardContainer = document.querySelector(".gameboard-container");
    const rotateButton = document.querySelector("#rotate");
    rotateButton.value = 'horizontal';
    const endGamePopup = document.querySelector(".game-over-popup");
    const endGameBackground = document.querySelector("#filter");
    const playAgainButton = document.querySelector("#replay");
    const winnerPrompt = document.querySelector("#winner");

    // builds boards to the DOM
    const buildBoardsUI = (playerOneBoard, playerTwoBoard) => {
        for (let i = 0; i < playerOneBoard.board.length; i += 1) {
            const squareID = playerOneBoard.board[i].id;
            const newSquare = document.createElement('div');
            newSquare.classList.add("board-square");
            newSquare.dataset.index = squareID;
            playerOneBoardUI.appendChild(newSquare);
            playerOneBoardUI.classList.add('visibility');
        }

        for (let i = 0; i < playerTwoBoard.board.length; i += 1) {
            const squareID = playerTwoBoard.board[i].id;
            const newSquare = document.createElement('div');
            newSquare.classList.add("board-square");
            newSquare.dataset.index = squareID;
            playerTwoBoardUI.appendChild(newSquare);
            playerTwoBoardUI.classList.add('visibility');
        }
    };

    // renders new game
    const displayNewGame = () => {
        boardContainer.removeChild(playerOneBoardUI);
        boardContainer.removeChild(playerTwoBoardUI);
        newGamePopup.appendChild(playerOneBoardUI);
        playerOneBoardUI.classList.remove('visibility');
    };

    // resets game
    const resetGame = () => {
        while (playerOneBoardUI.hasChildNodes()) {
            playerOneBoardUI.removeChild(playerOneBoardUI.lastChild);
        }
        while (playerTwoBoardUI.hasChildNodes()) {
            playerTwoBoardUI.removeChild(playerTwoBoardUI.lastChild);
        }
        playAgainButton.removeEventListener('click', handleEndGame);
        newGamePopup.classList.remove('visibility');
        playerTwoBoardUI.classList.toggle('game-end');
        playerOneBoardUI.getElementsByClassName.pointerEvents = 'all';
        rotateButton.value = 'horizontal';
        endGameBackground.classList.toggle('filter-opened');
        endGamePopup.classList.remove('open-end-game-popup');
    };

    // handles rotate button
    const handleRotateButton = () => {
        rotateButton.value =
            rotateButton.value === 'horizontal' ? 'vertical' : 'horizontal';
    };

    const handleEndGame = () => {
        playerTwoBoardUI.classList.toggle('game-end');
        resetGame();
        game.startGame();
    };

    // renders moves to DOM
    const renderMoves = (playerOne, playerTwo, playerTwoBoard) => {
        playerTwoBoardUI.childNodes.forEach((square) => {
            square.addEventListener('click', () => {
                const squareCoords = playerTwoBoard.getCoords(square.dataset.index);
                const isHit = playerOne.makeMove(squareCoords);
                if (isHit === true) {
                    square.classList.add('hit');
                } else if (isHit === false) {
                    square.classList.add('miss');
                }

                // checks if player won on last moves
                if (playerOne.checkWin()) {
                    winnerPrompt.textContent = "You Won!";
                    endGameBackground.classList.toggle('filter-opened');
                    endGamePopup.classList.add('open-end-game-popup');
                    playAgainButton.addEventListener('click', handleEndGame);
                    return null;
                }

                // AI moves
                const compMove = playerTwo.AIMove();
                playerOneBoardUI.childNodes.forEach((node) => {
                    if (Number(node.dataset.index) === Number(compMove.id)) {
                        if (compMove.filled) {
                            node.classList.add('hit');
                        } else if (!compMove.filled) {
                            node.classList.add('miss');
                        }
                    }
                });

                // checks if computer won on last move
                if (playerTwo.checkWin()) {
                    winnerPrompt.textContent = "You lost :(";
                    endGameBackground.classList.toggle('filter-opened');
                    endGamePopup.classList.add('open-end-game-popup');
                    playAgainButton.addEventListener('click', handleEndGame);
                    return null;
                }
            });
        });
    };

    // checks for squares on same row
    const isInSameRow = (index1, index2, rowSize) =>
        Math.floor(index1 / rowSize) === Math.floor(index2 / rowSize);
    
    // checks for squares on same column
    const isInSameCol = (index1, index2, colSize) =>
        index1 % colSize === index2 % colSize;
    
    // checks if ship can be legaly placed by user
    const canPlaceShip = (index, length, orientation, gridSquares) => {
        for (let i = 0; i < length; i += 1) {
            const hoverIndex =
                orientation === 'horizontal' ? index + i : index + i * 10;
            if (
                hoverIndex < 0 ||
                hoverIndex >= 100 ||
                gridSquares[hoverIndex].classList.contains('ship') ||
                (orientation === 'horizontal' && !isInSameRow(index, hoverIndex, 10)) ||
                (orientation === 'vertical' && !isInSameCol(index, hoverIndex, 10))
            ) {
                return false;
                }
        }
        return true;
    }

    // updates ship text prompt
    const updatePrompt = (index) => {
        if (index === 0) return 'Carrier';
        if (index === 1) return 'Battleship';
        if (index === 2) return 'Destroyer';
        if (index === 3) return 'Submarine';
        if (index === 4) return 'Patrol Boat';
    };

    // places ships on the board
    const placeShips = (board) => {
        rotateButton.addEventListener('click', handleRotateButton);

        const shipLengths = [5, 4, 3, 3, 2];
        let currentShipIndex = 0;

        const gridSquares = playerOneBoardUI.children;
        const textPrompt = document.querySelector("#place-ship");
        textPrompt.textContent = updatePrompt(currentShipIndex);

        const handleMouseEnter = () => (e) => {
            const index = Number(e.target.dataset.index);
            for (let i = 0; i < shipLengths[currentShipIndex]; i += 1) {
                const hoverIndex =
                    rotateButton.value === 'horizontal' ? index + i : index + i * 10;
                if (
                    hoverIndex >= 0 &&
                    hoverIndex < 100 &&
                    !gridSquares[hoverIndex].classList.contains('ship')
                ) {
                    if (
                        (rotateButton.value === 'horizontal' && isInSameRow(index, hoverIndex, 10)) ||
                        (rotateButton.value === 'vertical' && isInSameCol(index, hoverIndex, 10))
                    ) {
                        gridSquares[hoverIndex].classList.add('ship-selection');
                    }
                }
            }
        };

        const handleMouseLeave = () => (e) => {
            const index = Number(e.target.dataset.index);
            for (let i = 0; i < shipLengths[currentShipIndex]; i += 1) {
                const hoverIndex =
                    rotateButton.value === 'horizontal' ? index + i : index + i * 10;
                if (
                    hoverIndex >= 0 &&
                    hoverIndex < 100 &&
                    !gridSquares[hoverIndex].classList.contains('ship')
                ) {
                    if (
                        (rotateButton.value === 'horizontal' && isInSameRow(index, hoverIndex, 10)) ||
                        (rotateButton.value === 'vertical' && isInSameCol(index, hoverIndex, 10))
                    ) {
                        gridSquares[hoverIndex].classList.remove('ship-selection');
                    }
                }
            }
        };

        // click handlers
        const handleClicks = () => (e) => {
            const index = Number(e.target.dataset.index);
            const coords = board.getCoords(index);
            const orientation = rotateButton.value;
            const shipLength = shipLengths[currentShipIndex];

            if (canPlaceShip(index, shipLength, orientation, gridSquares)) {
                board.placeShip(shipLength, orientation, coords);
                for (let i = 0; i < shipLength; i += 1) {
                    const hoverIndex =
                        orientation === 'horizontal' ? index + i : index + i * 10;
                    if (
                        hoverIndex >= 0 &&
                        hoverIndex < 100 &&
                        !gridSquares[hoverIndex].classList.contains('ship')
                    ) {
                        if (
                            (orientation === 'horizontal' && isInSameRow(index, hoverIndex, 10)) ||
                            (orientation === 'vertical' && isInSameCol(index, hoverIndex, 10))
                        ) {
                            gridSquares[hoverIndex].classList.add('ship');
                            gridSquares[hoverIndex].classList.remove('ship-selection');
                        }
                    }
                }
                if (currentShipIndex === shipLengths.length - 1) {
                    // removes rotate button
                    rotateButton.removeEventListener('click', handleRotateButton);

                    // updates new game UI
                    newGamePopup.removeChild(playerOneBoardUI);
                    newGamePopup.classList.add('visibility');

                    boardContainer.appendChild(playerOneBoardUI);
                    boardContainer.appendChild(playerTwoBoardUI);

                    playerOneBoardUI.classList.remove('visibility');
                    playerTwoBoardUI.classList.remove('visibility');

                    playerOneBoardUI.style.pointerEvents = 'none';
                    return null;
                }
                currentShipIndex += 1;
                textPrompt.textContent = updatePrompt(currentShipIndex);
            }
        };
        for (const gridSquare of gridSquares) {
            gridSquare.addEventListener('mouseenter', handleMouseEnter(currentShipIndex));
            gridSquare.addEventListener('mouseleave', handleMouseLeave(currentShipIndex));
            gridSquare.addEventListener('click', handleClicks(currentShipIndex));
        }
    };

    return {
        displayNewGame,
        buildBoardsUI,
        renderMoves,
        placeShips
    };
}