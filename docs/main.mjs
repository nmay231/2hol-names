import { findClosestName, getNameOffsetBack, getNameOffsetForward, sharedPrefix, subString } from "./lib.mjs";

const lastNameSelected = document.getElementById("first-or-last-last");
const firstNameSelected = document.getElementById("first-or-last-first");
const nameSearch = document.getElementById("name-search");

let firstNames;
let lastNames;

fetch("./firstNames.txt").then(response => response.text()).then(text => {
    firstNames = text;
});

fetch("./lastNames.txt").then(response => response.text()).then(text => {
    lastNames = text;
});


const defaultFirst = "AABAN";
const defaultLast = "ZYWICKI";

let searchType = "first";

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

/**
 * @param {string} nameList
 * @param {string} attemptedName
 */
const updateListOfAdjacentNames = (nameList, attemptedName) => {
    const indexOfClosest = findClosestName(nameList, attemptedName);

    let names = [];
    let index = indexOfClosest;
    for (let i = 0; i < 10; i++) {
        if (index === 0) {
            break;
        }
        index = getNameOffsetBack(nameList, index - 2);

        names.push(subString(nameList, index));
    }

    const numberOfNamesBefore = nameList.substring(0, index).split('\n').length;
    names.reverse();
    names.push(subString(nameList, indexOfClosest));

    index = indexOfClosest;
    let previousIndex = index;
    for (let i = 0; i < 10; i++) {
        index = getNameOffsetForward(nameList, index);
        if (index === previousIndex) {
            break;
        }
        previousIndex = index;

        names.push(subString(nameList, index));
    }

    // TODO: How to change starting index of list if I use <ol>?
    const closestName = subString(nameList, indexOfClosest);
    const list = document.createElement("ol");
    list.start = numberOfNamesBefore;

    for (const name of names) {
        const li = document.createElement("li");
        if (name !== closestName) {
            li.innerText = name;
        } else {
            const prefix = sharedPrefix(name, attemptedName);
            const color = name === attemptedName ? "green" : "#00c0ff";
            li.innerHTML = `<strong style="color: ${color};">${prefix}</strong>${name.substring(prefix.length)}`;
        }
        list.appendChild(li);
    }
    const output = document.getElementById("names-output");
    while (output.hasChildNodes()) {
        output.removeChild(output.firstChild);
    }
    output.appendChild(list);

}

const nameSearchHandler = () => {
    const attemptedName = nameSearch.value.toUpperCase() || (searchType === "last" ? defaultLast : defaultFirst);
    const nameList = searchType === "last" ? lastNames : firstNames;
    updateListOfAdjacentNames(nameList, attemptedName);
}

nameSearch.addEventListener("input", nameSearchHandler);
