import Gameboard from "../gameboard";
import Player from "../player";

describe("player", () => {
  let playerOneBoard;
  let playerTwoBoard;

  beforeEach(() => {
    playerOneBoard = Gameboard();
    playerTwoBoard = Gameboard();
  });

  test("AI can move", () => {
    const AI = Player(playerTwoBoard, playerOneBoard);
    playerOneBoard.placeShip(3, "vertical", [0, 0]);
    const move = AI.AIMove();
    expect(move).not.toBeNull();
  });

  test("Player move targets correct square on board - miss", () => {
    const player = Player(playerOneBoard, playerTwoBoard);
    player.makeMove([0, 0]);
    expect(playerTwoBoard.missedShots[0]).toBe(
      playerTwoBoard.getSquare([0, 0])
    );
  });

  test("Player moves targets to correct squares on board - hits", () => {
    const player = Player(playerOneBoard, playerTwoBoard);
    playerTwoBoard.placeShip(3, "horizontal", [0, 0]);
    player.makeMove([0, 0]);
    player.makeMove([0, 1]);
    expect(playerTwoBoard.allShips[0].getHits()).toBe(2);
  });

  test("Player sinks ship", () => {
    const player = Player(playerOneBoard, playerTwoBoard);
    playerTwoBoard.placeShip(3, "horizontal", [0, 0]);
    player.makeMove([0, 0]);
    player.makeMove([0, 1]);
    player.makeMove([0, 2]);
    expect(playerTwoBoard.allShips[0].isSunk()).toBe(true);
  });

  test("Player correctly sinks all ships", () => {
    const player = Player(playerOneBoard, playerTwoBoard);
    playerTwoBoard.placeShip(3, "horizontal", [0, 0]);
    playerTwoBoard.placeShip(2, "vertical", [5, 0]);
    player.makeMove([0, 0]);
    player.makeMove([0, 1]);
    player.makeMove([0, 2]);
    player.makeMove([5, 0]);
    player.makeMove([6, 0]);
    expect(playerTwoBoard.shipsSunk()).toBe(true);
  });

  test("Player wins", () => {
    const player = Player(playerOneBoard, playerTwoBoard);
    playerTwoBoard.placeShip(3, "horizontal", [0, 0]);
    player.makeMove([0, 0]);
    player.makeMove([0, 1]);
    player.makeMove([0, 2]);
    player.checkWin();
    expect(player.getWins()).toBe(1);
  });
});