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

const input = document.querySelector('input')

const onInput = async event => {                    //add async sice we are adding await
    const movies = await fetchData(event.target.value)          //send input value to api to search movie        //returns promise so add await
    for (let movie of movies) {
        const div = document.createElement('div')
        div.innerHTML = `
            <img src="${movie.Poster}">
            <h1>${movie.Title}</h1>
        `;
        document.querySelector('#target').appendChild(div)
    }
}
input.addEventListener('input', debounce(onInput, 1000))     //for searching movie for every single keypress
