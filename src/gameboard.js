import Ship from "./ship";

export default function Gameboard() {
    const allShips = [];
    const missedShots = [];

    const createBoard = () => {
        const board = [];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                board.push(Square([i, j], false));
            }
        }
        return board;
    };

    const board = createBoard();

    // determines if square is filled
    const isSquareFilled = (coords) => {
        const correspondingSquare = board.find(
            (sq) => sq.coords.toString() === coords.toString()
        );
        return correspondingSquare.filled;
    };

    // fills square
    const fillSquare = (coords) => {
        const correspondingSquare = board.find(
            (sq) => sq.coords.toString() === coords.toString()
        );
        correspondingSquare.filled = true;
    };

    // gets corresponding square
    const getSquare = (coords) =>
        board.find((sq) => sq.coords.toString() === coords.toString());
    
    // gets board coordinates based on square ID
    const getCoords = (squareID) => {
        const square = board.find((sq) => sq.id.toString() === squareID.toString());
        return square.coords;
    };

    // gets square based on ID
    const getSquareGivenID = (input) =>
        board.find((sq) => sq.id.toString() === input.toString());
    
    // finds ship given board coordinates
    const findShip = (coords) => {
        for (let i = 0; i < allShips.length; i++) {
            const ship = allShips[i];
            const shipLocation = ship.getLocation();

            for (let j = 0; j < shipLocation.length; j++) {
                const coordinate = shipLocation[j];
                if (coordinate.toString() === coords.toString()) {
                    return ship;
                }
            }
        }
        return null;
    };

    // places ship on board
    const placeShip = (length, orientation, coords) => {
        const shipLocation = [];
        let isPlacementOk = true;

        // checks placement for vertical/horizontal switch
        if (orientation === 'vertical') {
            let coordX = coords[0];
            for (let i = 0; i < length; i++) {
                // checks for out of bounds
                if (coordX < 0 || coordX > 9) {
                    return null;
                }
                const coordinates = [coordX, coords[1]];
                shipLocation.push(coordinates);
                coordX += 1;
            }
        } else if (orientation === 'horizontal') {
            let coordY = coords[1];
            for (let i = 0; i < length; i++) {
                if (coordY < 0 || coordY > 9) {
                    return null;
                }
                const coordinates = [coords[0], coordY];
                shipLocation.push(coordinates);
                coordY += 1;
            }
        }
        // checks for overlapping ships
        shipLocation.forEach((coordinate) => {
            if (isSquareFilled(coordinate)) {
                isPlacementOk = false;
            }
        });
        if (!isPlacementOk) {
            return null;
        }
        // otherwise create ship and fill squares
        shipLocation.forEach((coordinate) => fillSquare(coordinate));
        const newShip = Ship(length, shipLocation);
        allShips.push(newShip);

        return newShip;
    };

    // places AI ships
    const placeAIShips = () => {
        const shipLengths = [5, 4, 3, 3, 2];
        const orientations = ['vertical', 'horizontal'];

        while (allShips.length < 5) {
            const randomNum = Math.floor(Math.random() * (200 - 100) + 100);
            const randomCoords = getCoords(randomNum);

            const randomOrientation = orientations[Math.floor(Math.random() * orientations.length)];
            const randomShipLength = shipLengths[Math.floor(Math.random() * shipLengths.length)];

            const newShip = placeShip(randomShipLength, randomOrientation, randomCoords);

            if (newShip) {
                const currentShipIndex = shipLengths.indexOf(randomShipLength);
                shipLengths.splice(currentShipIndex, 1);
            }
        }
    };

    // resets ships
    const resetShips = () => {
        allShips.length = 0;
    };

    // resets board
    const resetBoard = () => {
        board.forEach((square) => {
            square.filled = false;
        });
    };

    // fills in squares based on attack
    const receiveHit = (coords) => {
        if (!isSquareFilled(coords)) {
            missedShots.push(getSquare(coords));
            return getSquare(coords).filled;
        }
        const targetedShip = findShip(coords);
        targetedShip.hit();

        return getSquare(coords).filled;
    };

    // checks for all sunk ships
    const shipsSunk = () => allShips.every((ship) => ship.isSunk());

    const getShipLocations = () => {
        const shipLocationIDs = [];
        allShips.forEach((ship) => {
            const shipLocation = ship.getLocation();
            shipLocation.forEach((coord) => {
                shipLocationIDs.push(getSquare(coord).id);
            });
        });
        return shipLocationIDs;
    };

    return {
        placeAIShips,
        resetShips,
        resetBoard,
        getSquareGivenID,
        getCoords,
        getShipLocations,
        board,
        getSquare,
        findShip,
        missedShots,
        allShips,
        shipsSunk,
        receiveHit,
        placeShip
    };
}

function Square(coords, filled) {
    if (typeof Square.currentID === 'undefined') {
        Square.currentID = 0;
    } else {
        Square.currentID++;
    }
    const id = Square.currentID;
    return { id, coords, filled };
}