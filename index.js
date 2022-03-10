//config object specific to application

const autoCompleteConfig = {
    renderOption(movie) {                  //how movie item in search results will look
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster   //for broken images show nothing
        return `
            <img src="${imgSrc}">
            ${movie.Title} (${movie.Year})
        `;
    },

    inputValue(movie) {
        return movie.Title
    },

    async fetchData(searchTerm) {
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

}

createAutoComplete({
    ...autoCompleteConfig,         //copy autoCompleteConfig object properties
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        onMovieSelect(movie, document.querySelector('#left-summary'))
        document.querySelector('.tutorial').classList.add('is-hidden')
    },
})

createAutoComplete({
    ...autoCompleteConfig,         //copy autoCompleteConfig object properties
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        onMovieSelect(movie, document.querySelector('#right-summary'))
        document.querySelector('.tutorial').classList.add('is-hidden')
    },
})

const onMovieSelect = async (movie, summaryElement) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {                //query params passed
            apikey: '279fb3a4',
            i: movie.imdbID            //for getting the movie details
        }
    })
    summaryElement.innerHTML = movieTemplate(response.data)     //render movie details
}

const movieTemplate = movieDetail => {
    return `
        <article class='media'>
            <figure class='media-left'>
                <p class='image'>
                    <img src='${movieDetail.Poster}'>
                </p>
            </figure>
            <div class='media-content>
                <div class='content'>
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article class='notification is-primary'>
            <p class='title'>${movieDetail.Awards}</p>
            <p class='subtitle'>Awards</p>
        </article>
         <article class='notification is-primary'>
            <p class='title'>${movieDetail.BoxOffice}</p>
            <p class='subtitle'>Box Office</p>
        </article>
         <article class='notification is-primary'>
            <p class='title'>${movieDetail.Metascore}</p>
            <p class='subtitle'>Metascore</p>
        </article>
         <article class='notification is-primary'>
            <p class='title'>${movieDetail.imdbRating}</p>
            <p class='subtitle'>IMDB Rating</p>
        </article>
         <article class='notification is-primary'>
            <p class='title'>${movieDetail.imdbVotes}</p>
            <p class='subtitle'>IMDB Votes</p>
        </article>
    `
}
