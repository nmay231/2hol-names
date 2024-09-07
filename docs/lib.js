const lastNameSelected = document.getElementById('first-or-last-last');
const firstNameSelected = document.getElementById('first-or-last-first');

const setSearchType = (event) => {
    const searchType = event.target.value;
    if (searchType === 'last') {
        lastNameSelected.checked = true;
        document.getElementById('name-search-label').innerText = "I am";
        nameSearch.placeholder = "ZYWICKI";
    } else {
        firstNameSelected.checked = true;
        document.getElementById('name-search-label').innerText = "You are";
        nameSearch.placeholder = "AABAN";
    }

    nameSearch.focus();
}

lastNameSelected.addEventListener('change', setSearchType);
firstNameSelected.addEventListener('change', setSearchType);

const nameSearch = document.getElementById('name-search');
