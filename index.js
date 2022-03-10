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
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
        document.querySelector('.tutorial').classList.add('is-hidden')
    },
})

createAutoComplete({
    ...autoCompleteConfig,         //copy autoCompleteConfig object properties
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
        document.querySelector('.tutorial').classList.add('is-hidden')
    },
})
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {                //query params passed
            apikey: '279fb3a4',
            i: movie.imdbID            //for getting the movie details
        }
    })
    summaryElement.innerHTML = movieTemplate(response.data)     //render movie details

    if (side === 'left') {
        leftMovie = response.data
    }
    else {
        rightMovie = response.data
    }

    if (leftMovie && rightMovie) {
        runComparison()
    }
}

// const runComparison = () = {

// }
const movieTemplate = movieDetail => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))  //remove dollar sign and comma and convert string into number
    const metascore = parseInt(movieDetail.Metascore)       //convert string into number
    const imdbRating = parseFloat(movieDetail.imdbRating)
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
    let count = 0;
    const awards = movieDetail.Awards.split(' ').forEach(word => {
        const value = parseInt(word)
        if (isNaN(value)) {         //check if word is a number
            return           //return null
        }
        else {
            return count = count + value         //add all numbers
        }
    });
    console.log(count);

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
