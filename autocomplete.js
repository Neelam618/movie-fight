const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {               //application specific data is sent through config object  //root is key
    root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input">
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`
    const input = root.querySelector('input')
    const dropdown = root.querySelector('.dropdown')
    const resultsWrapper = root.querySelector('.results')

    const onInput = async event => {                    //add async sice we are adding await
        const items = await fetchData(event.target.value)          //send input value to api to search movie        //returns promise so add await
        if (!items.length) {
            dropdown.classList.remove('is-active')
            return
        }
        dropdown.classList.add('is-active')
        resultsWrapper.innerHTML = ''            //to clear the last search results and avoid overriding results
        for (let item of items) {
            const option = document.createElement('a')
            option.classList.add('dropdown-item')
            option.innerHTML = renderOption(item)
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active')    //close dropdown on selecting option
                input.value = inputValue(item)               //to update movie title in input field when selected
                onOptionSelect(item)
            })
            resultsWrapper.appendChild(option)
        }
    }
    input.addEventListener('input', debounce(onInput, 1000))     //for searching movie for every single keypress

    document.addEventListener('click', event => {         //when user clicks outside dropdown
        if (!root.contains(event.target)) {              //autocomplete element is not clicked
            dropdown.classList.remove('is-active')
        }
    })
}