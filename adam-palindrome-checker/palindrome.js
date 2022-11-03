let inputs = ["deified", "algorithm", "100010001", "level", "rotator", "javascript", "words", "baba", "haha"];

const output = [];

const palindromeChecker = () => {

    for (let i = 0; i < inputs.length; i++) {
        let word = inputs[i];
        let status = 'palindrome';
        if (typeof inputs[i] === 'number') {
            word = inputs[i].toString();
        }

        for (let x = 0; x < word.length; x++) {
            if (word[x] !== word[word.length - x - 1]) {
                status = 'not a palindrome';
            }
        }

        output.push({ name: word, type: status });
    }
}

palindromeChecker();
console.log(output);
