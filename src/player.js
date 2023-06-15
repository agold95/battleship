export default function Player(playerBoard, enemyBoard) {
    let wins = 0;
    const moves = new Set();

    const getWins = () => wins;
    const increaseWins = () => wins++;

    const makeMove = (coords) => {
        const targetedSquare = enemyBoard.getSquare(coords);
        if (!moves.has(targetedSquare)) {
            enemyBoard.receiveHit(coords);
            moves.add(targetedSquare);
        }
        return targetedSquare.filled;
    };

    const AIMove = () => {
        let targetedSquare;
        let foundMove = false;

        while (!foundMove && moves.size < 100) {
            const randomNum = Math.floor(Math.random() * 100);
            const randomSquare = enemyBoard.getSquareGivenID(randomNum);
            if (!moves.has(randomSquare)) {
                enemyBoard.receiveHit(enemyBoard.getCoords(randomNum));
                moves.add(randomSquare);
                foundMove = true;
                targetedSquare = randomSquare;
            }
        }
        return targetedSquare;
    };

    const checkWin = () => {
        if (enemyBoard.shipsSunk()) {
            increaseWins();
            return true;
        }
        return false;
    }

    return { makeMove, AIMove, moves, getWins, checkWin };
}