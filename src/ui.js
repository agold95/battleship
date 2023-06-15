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
    const playAgainButton = document.querySelector("#play-again");
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
        newGamePopup.appendChild(playerTwoBoardUI);
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
                    winnerPrompt.textContent = "You won!";
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
    const isInSameRow = ()
}