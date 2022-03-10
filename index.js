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

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index]
        // console.log(leftStat, rightStat);
        const leftSideValue = parseInt(leftStat.dataset.value)             //data-value property
        const rightSideValue = parseInt(rightStat.dataset.value)             //data-value property
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary')
            leftStat.classList.add('is-warning')
        }
        else {
            rightStat.classList.remove('is-primary')
            rightStat.classList.add('is-warning')
        }
    })
}

const movieTemplate = movieDetail => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))  //remove dollar sign and comma and convert string into number
    const metascore = parseInt(movieDetail.Metascore)       //convert string into number
    const imdbRating = parseFloat(movieDetail.imdbRating)
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
    let awardsCount = 0;
    const awards = movieDetail.Awards.split(' ').forEach((word) => {          //or reduce() can be used 
        const value = parseInt(word)
        if (!isNaN(value)) {         //check if word is a number
            return awardsCount = awardsCount + value         //add all numbers
        }
    });
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
        <article data-value=${awardsCount} class='notification is-primary'>
            <p class='title'>${movieDetail.Awards}</p>
            <p class='subtitle'>Awards</p>
        </article>
         <article data-value=${dollars} class='notification is-primary'>
            <p class='title'>${movieDetail.BoxOffice}</p>
            <p class='subtitle'>Box Office</p>
        </article>
         <article data-value=${metascore} class='notification is-primary'>
            <p class='title'>${movieDetail.Metascore}</p>
            <p class='subtitle'>Metascore</p>
        </article>
         <article data-value=${imdbRating} class='notification is-primary'>
            <p class='title'>${movieDetail.imdbRating}</p>
            <p class='subtitle'>IMDB Rating</p>
        </article>
         <article data-value=${imdbVotes} class='notification is-primary'>
            <p class='title'>${movieDetail.imdbVotes}</p>
            <p class='subtitle'>IMDB Votes</p>
        </article>
    `
}
