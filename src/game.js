import Player from "./player";
import Gameboard from "./gameboard";
import GameController from "./ui";

const playerOneBoard = Gameboard();
const playerTwoBoard = Gameboard();

export default function Game() {
    const startGame = () => {
        const game = GameController();
        playerOneBoard.resetBoard();
        playerOneBoard.resetShips();
        playerTwoBoard.resetBoard();
        playerTwoBoard.resetShips();

        // adds players and board
        const playerOne = Player(playerOneBoard, playerTwoBoard);
        const playerTwo = Player(playerTwoBoard, playerOneBoard);
        game.buildBoardsUI(playerOneBoard, playerTwoBoard);

        // place AI ships
        playerTwoBoard.placeAIShips();

        // place user ships
        game.displayNewGame();
        game.placeShips(playerOneBoard);

        // play rounds
        game.renderMoves(playerOne, playerTwo, playerTwoBoard);
    };
    return { startGame };
}