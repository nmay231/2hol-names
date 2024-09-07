import { findClosestName, sharedPrefix } from "./lib.mjs";

const lastNameSelected = document.getElementById("first-or-last-last");
const firstNameSelected = document.getElementById("first-or-last-first");
const nameSearch = document.getElementById("name-search");

export let firstNames = [];
export let lastNames = [];

fetch("./firstNames.txt").then(response => response.text()).then(text => {
    firstNames = text.trim().split("\n");
});

fetch("./lastNames.txt").then(response => response.text()).then(text => {
    lastNames = text.trim().split("\n");
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

const nameSearchHandler = () => {
    const attemptedName = nameSearch.value.toUpperCase() || (searchType === "last" ? defaultLast : defaultFirst);
    const nameList = searchType === "last" ? lastNames : firstNames;
    updateListOfAdjacentNames(nameList, attemptedName);
}

nameSearch.addEventListener("input", nameSearchHandler);
