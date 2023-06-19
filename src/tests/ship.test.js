import Ship from "../ship";

describe("ships", () => {
  const newShip = Ship(3);

  test("gets hit", () => {
    newShip.hit();
    expect(newShip.getHits()).toBe(1);
  });

  test("gets sunk", () => {
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toBe(true);
  });
});