export default function Ship(length, location) {
    let health = length;
    let sunk = false;
    let hits = 0;

    const getLength = () => length;

    const isSunk = () => sunk;
    const getHits = () => hits;
    const getLocation = () => location;

    const hit = () => {
        health -= 1;
        hits += 1;
        if (health <= 0) {
            sunk = true;
        }
    };

    return { getLength, getHits, getLocation, hit, isSunk };
}