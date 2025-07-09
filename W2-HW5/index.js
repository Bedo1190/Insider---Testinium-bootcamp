function collatzSequence(n) {
    const sequence = [n];

    while (n !== 1) {
        if (n % 2 === 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        sequence.push(n);
    }

    return sequence;
}

function findLongestCollatz(limit) {
    let maxLength = 0;
    let numberWithMax = 1;
    let longestSequence = [];

    for (let i = 1; i < limit; i++) {
        const sequence = collatzSequence(i);
        if (sequence.length > maxLength) {
            maxLength = sequence.length;
            numberWithMax = i;
            longestSequence = sequence;
        }
    }

    console.log(`Longest Collatz sequence under ${limit} is produced by ${numberWithMax}:`);
    console.log(longestSequence.join(" -> "));
}

console.log(collatzSequence(13));
findLongestCollatz(10);