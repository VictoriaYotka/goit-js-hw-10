const BASE_URL = 'https://restcountries.com/v3.1/'

const countryNameOfficial = 'name';
const countryCapital = 'capital';
const countryPopulation = 'population';
const countryFlagsSvg = 'flags';
const countryLanguages = 'languages';

export default function fetchCountries (name) {
    return fetch(`${BASE_URL}name/${name}?fields=${countryNameOfficial},${countryCapital},${countryPopulation},${countryFlagsSvg},${countryLanguages}`)
    .then((res) => {
        if (!res.ok) {
            throw new Error (res.statusText)
        }
        // console.log(res);
        return res.json();
    })
    };