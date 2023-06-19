export default function Ship(length, location) {
    const getLength = () => length;

    let health = length;
    let sunk = false;
    let hits = 0;

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