const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {                //query params passed
            apikey: '279fb3a4',
            s: searchTerm            //for searching the movie containing searchTerm
        }
    })
    console.log(response.data);
}

const input = document.querySelector('input')

const onInput = event => {
    fetchData(event.target.value)          //send input value to api to search movie
}
input.addEventListener('input', debounce(onInput, 1000))     //for searching movie for every single keypress
