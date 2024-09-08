import { spawn } from "child_process";
import fs from "fs";
import { findClosestName, subString } from "./docs/lib.mjs";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomString = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += ALPHABET[random(0, ALPHABET.length - 1)];
    }
    return result;
}

(async () => {

    let testNames = [
        ...Array.from(ALPHABET),
    ]

    const firstNames = fs.readFileSync('./docs/firstNames.txt').toString();
    const lastNames = fs.readFileSync('./docs/lastNames.txt').toString();
    
    const firstNamesList = firstNames.trim().split('\n');
    const lastNamesList = lastNames.trim().split('\n');

    const grunge = (name) => {
        const slice = name.slice(0, random(0, name.length - 1));
        testNames.push(name, slice, `${slice}${randomString(random(0, 10))}`);
    }

    for (let i = 0; i < 1000; i++) {
        grunge(firstNamesList[random(0, firstNamesList.length - 1)]);
        grunge(lastNamesList[random(0, lastNamesList.length - 1)]);
        testNames.push(randomString(random(0, 10)));
    }

    for (let i = 0; i < 10; i++) {
        grunge(firstNamesList[0]);
        grunge(firstNamesList[firstNamesList.length - 1]);
        grunge(lastNamesList[0]);
        grunge(lastNamesList[lastNamesList.length - 1]);
    }

    testNames = testNames.filter((name, index, self) => self.indexOf(name) === index);

    console.log(testNames.length);


    const child = spawn('./main');
    const output = [];
    child.stdout.on('data', (data) => {
        output.push(...data.toString().trim().split('\n').map(names => {
            const [first, last] = names.trim().split(':');
            return { first, last };
        }));
    });
    child.stderr.on('data', (data) => {
        console.log(data.toString());
    });

    for (const name of testNames) {
        child.stdin.write(`${name}\n`);
    }
    child.stdin.end();

    child.on('close', () => {
        console.log("Lengths should be the same:", testNames.length, output.length);

        for (let i = 0; i < output.length; i++) {
            const input = testNames[i];
            const expected = output[i];
            const firstIndex = findClosestName(firstNames, input);
            const firstName = subString(firstNames, firstIndex);
            const lastIndex = findClosestName(lastNames, input);
            const lastName = subString(lastNames, lastIndex);

            if (firstName !== expected.first) {
                console.log("Mismatch:", input, "expected =", expected.first, "actual =", firstName);
                console.log(firstNames.slice(Math.max(0, firstIndex - 25), firstIndex + 25));
            } else {
                // console.log("First name:", input, "=>", firstName,"=", expected.first);
            }
            if (lastName !== expected.last) {
                console.log("Mismatch:", input, expected.last, lastName);
                console.log(lastNames.slice(Math.max(0, lastIndex - 25), lastIndex + 25));
            }
        }
    });


})();
