//Debouncing an input (Waiting for some time to pass after last event to actually do something)
//logic to avoid continuously sending request when user changes input.
// if user doesn't type anything for one sec request will be sent for searching movie 

// let timeoutId;
// const onInput = (event) => {
//     if (timeoutId) {
//         clearTimeout(timeoutId)            //cancel running setTimeout (cancel sending input value to fetch search results)
//     }
//     timeoutId = setTimeout(() => {
//         fetchData(event.target.value)          //send input value to api to search movie
//     }, 1000)
// }
// input.addEventListener('input', onInput)     //for searching movie for every single keypress

//OR
const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {        //all args
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args)            //func(all args)
        }, delay)
    }
}
