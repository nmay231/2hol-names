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
    nameSearchHandler();
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


const updateListOfAdjacentNames = (nameList, attemptedName) => {
    const index = findClosestName(nameList, attemptedName);
    console.log(nameList[index]);

    // TODO: How to change starting index of list if I use <ol>?
    const list = document.createElement("ul");
    const upperBound = Math.min(index + 10, nameList.length);
    for (let i = Math.max(0, index - 10); i < upperBound; i++) {
        const li = document.createElement("li");
        if (i !== index) {
            li.innerText = nameList[i];
        } else {
            const prefix = sharedPrefix(nameList[i], attemptedName);
            li.innerHTML = `<strong style="color: green;">${prefix}</strong>${nameList[i].substring(prefix.length)}`;
        }
        list.appendChild(li);
    }
    const output =document.getElementById("names-output");
    while (output.hasChildNodes()) {
        output.removeChild(output.firstChild);
    }
    output.appendChild(list);

}
const findClosestName = (nameList, attemptedName) => {
    if (attemptedName < nameList[0]) {
        return 0;
    } else if (attemptedName > nameList[nameList.length - 1]) {
        return nameList.length - 1
    } else {
        let min = 0;
        let max = nameList.length - 1;
        let mid = Math.trunc((min + max) / 2);

        while (min < max) {
            let possibleMatch = nameList[mid];
            if (attemptedName === possibleMatch) {
                return mid;
            } else if (attemptedName < possibleMatch) {
                max = Math.max(mid - 1, min);
            } else if (attemptedName > possibleMatch) {
                min = Math.min(mid + 1, max);
            }
            mid = Math.trunc((min + max) / 2);
        }

        const closest = nameList.slice(mid, mid + 2);

        if (closest.length !== 2) {
            throw new Error("Expected two closest names");
        }
        const [before, after] = closest;
        const sharedBefore = sharedPrefix(before, attemptedName);
        const sharedAfter = sharedPrefix(after, attemptedName);
        if (sharedBefore.length > sharedAfter.length) {
            return mid;
        } else if (sharedBefore.length < sharedAfter.length) {
            return mid + 1;
        } else {
            return before.length < after.length ? mid : mid + 1;
        }
    }
}

const nameSearchHandler = () => {
    const attemptedName = nameSearch.value.toUpperCase() || (searchType === "last" ? defaultLast : defaultFirst);
    const nameList = searchType === "last" ? lastNames : firstNames;
    updateListOfAdjacentNames(nameList, attemptedName);
}

nameSearch.addEventListener("input", nameSearchHandler);
