import Gameboard from "../gameboard";

describe("gameboard", () => {
  let newGameboard;

  beforeEach(() => {
    newGameboard = Gameboard();
  });

  test("correct ship location in square ids returned", () => {
    newGameboard.placeShip(3, "horizontal", [0, 0]);
    expect(newGameboard.getShipLocations().toString()).toBe(
      [0, 1, 2].toString()
    );
  });

  test("ship cannot be placed out of bounds - vertically", () => {
    expect(newGameboard.placeShip(3, "vertical", [9, 0])).toBeNull();
  });

  test("ship cannot be placed out of bounds - horizontally", () => {
    expect(newGameboard.placeShip(4, "horizontal", [5, 7])).toBeNull();
  });

  test("no horizontal overlap", () => {
    newGameboard.placeShip(4, "horizontal", [0, 0]);
    expect(newGameboard.placeShip(4, "horizontal", [0, 1])).toBeNull();
  });

  test("no vertical overlap", () => {
    newGameboard.placeShip(4, "vertical", [5, 0]);
    expect(newGameboard.placeShip(3, "vertical", [6, 0])).toBeNull();
  });

  test("accurate attack successfully hits ship", () => {
    newGameboard.placeShip(4, "horizontal", [0, 0]);
    newGameboard.receiveHit([0, 0]);
    const ship = newGameboard.allShips[0];
    expect(ship.getHits()).toBe(1);
  });

  test("accurate hit returns true", () => {
    newGameboard.placeShip(4, "horizontal", [0, 0]);
    expect(newGameboard.receiveHit([0, 0])).toBe(true);
  });

  test("missed shots correctly returns false", () => {
    newGameboard.placeShip(4, "horizontal", [0, 0]);
    expect(newGameboard.receiveHit([1, 0])).toBe(false);
  });

  test("inaccurate attacks get recorded as missed shots", () => {
    newGameboard.placeShip(4, "horizontal", [0, 0]);
    newGameboard.receiveHit([1, 0]);
    newGameboard.receiveHit([1, 0]);
    expect(newGameboard.missedShots.length).toBe(2);
  });

  test("ships correctly sink", () => {
    newGameboard.placeShip(1, "horizontal", [1, 0]);
    newGameboard.placeShip(3, "horizontal", [0, 0]);
    newGameboard.receiveHit([0, 0]);
    newGameboard.receiveHit([0, 1]);
    newGameboard.receiveHit([0, 2]);
    newGameboard.receiveHit([1, 0]);
    expect(newGameboard.shipsSunk()).toBe(true);
  });
});