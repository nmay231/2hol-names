const lastNameSelected = document.getElementById("first-or-last-last");
const firstNameSelected = document.getElementById("first-or-last-first");
const nameSearch = document.getElementById("name-search");


const defaultFirst = "AABAN";
const defaultLast = "ZYWICKI";

let searchType = "last";

const setSearchType = (event) => {
    const newSearchType = event.target.value;
    if (newSearchType === "last") {
        lastNameSelected.checked = true;
        document.getElementById("name-search-label").innerText = "I am";
        nameSearch.placeholder = defaultLast;
        searchType = "last";
    } else {
        firstNameSelected.checked = true;
        document.getElementById("name-search-label").innerText = "You are";
        nameSearch.placeholder = defaultFirst;
        searchType = "first";
    }

    nameSearch.focus();
}

lastNameSelected.addEventListener("change", setSearchType);
firstNameSelected.addEventListener("change", setSearchType);

let firstNames = [];
let lastNames = [];

fetch("./firstNames.txt").then(response => response.text()).then(text => {
    firstNames = text.trim().split("\n");
});

fetch("./lastNames.txt").then(response => response.text()).then(text => {
    lastNames = text.trim().split("\n");
});


const sharedPrefix = (a, b) => {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
        i++;
    }
    return a.substring(0, i);
}


const filterNames = (event) => {
    const attemptedName = event.target.value.toUpperCase() || (searchType === "last" ? defaultLast : defaultFirst);
    const nameList = searchType === "last" ? lastNames : firstNames;
    const result = searchNames(nameList, attemptedName);
    if (result) {
        document.getElementById("names-output").innerHTML = `<h3>Closest Names</h3>
        <ul>
            <li>${result}</li>
        </ul>`;
    }

}
const searchNames = (nameList, attemptedName) => {
    let result = null;

    if (attemptedName < nameList[0]) {
        result = nameList[0];
    } else if (attemptedName > nameList[nameList.length - 1]) {
        result = nameList[nameList.length - 1];
    } else {
        let min = 0;
        let max = nameList.length - 1;
        let mid = Math.trunc((min + max) / 2);

        while (min < max) {
            let possibleMatch = nameList[mid];
            if (attemptedName === possibleMatch) {
                result = possibleMatch;
                break;
            } else if (attemptedName < possibleMatch) {
                max = Math.max(mid - 1, min);
            } else if (attemptedName > possibleMatch) {
                min = Math.min(mid + 1, max);
            }
            mid = Math.trunc((min + max) / 2);
        }

        if (result === null) {
            const closest = nameList.slice(Math.max(0, mid - 1), mid + 2).slice(-2);

            if (closest.length !== 2) {
                throw new Error("Expected two closest names");
            }
            const [before, after] = closest;
            const sharedBefore = sharedPrefix(before, attemptedName);
            const sharedAfter = sharedPrefix(after, attemptedName);
            if (sharedBefore.length > sharedAfter.length) {
                result = before;
            } else if (sharedBefore.length < sharedAfter.length) {
                result = after;
            } else {
                result = before.length < after.length ? before : after;
            }
            console.log(closest, min, max, mid);
        }
    }

    console.log("result =", result);
    // TODO: Just return in place
    return result;
}

nameSearch.addEventListener("input", filterNames);
