const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {                //query params passed
            apikey: '279fb3a4',
            s: searchTerm            //for searching the movie containing searchTerm
        }
    })
    if (response.data.Error) {
        return []
    }
    return response.data.Search            //returns a promise
}
const root = document.querySelector('.autocomplete')
root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class="input">
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`
const input = document.querySelector('input')
const dropdown = document.querySelector('.dropdown')
const resultsWrapper = document.querySelector('.results')

const onInput = async event => {                    //add async sice we are adding await
    const movies = await fetchData(event.target.value)          //send input value to api to search movie        //returns promise so add await
    if (!movies.length) {
        dropdown.classList.remove('is-active')
        return
    }
    dropdown.classList.add('is-active')
    resultsWrapper.innerHTML = ''            //to clear the last search results and avoid overriding results
    for (let movie of movies) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster   //for broken images show nothing
        const option = document.createElement('a')
        option.classList.add('dropdown-item')
        option.innerHTML = `
            <img src="${imgSrc}">
            <h1>${movie.Title}</h1>
        `;
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active')    //close dropdown on selecting option
            input.value = movie.Title               //to update movie title in input field when selected
            onMovieSelect(movie)
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

const onMovieSelect = async movie => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {                //query params passed
            apikey: '279fb3a4',
            i: movie.imdbID            //for getting the movie details
        }
    })
}
