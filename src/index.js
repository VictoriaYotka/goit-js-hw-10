import './css/styles.css';
import { fetchCountries } from './fetchCountries';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
    timeout: 2000,
    cssAnimationDuration: 200,
    showOnlyTheLastOne: true, 
});

const inputEl = document.querySelector('#search-box');
const countriesListEl = document.querySelector('.country-list');
const countryCardEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler (event) {
    const searchQuery = event.target.value.trim();

    if(searchQuery === '') {
        clearAllInfo();
        return
    }

    fetchCountries(inputEl.value)
    .then(data => {
        // console.log(data);

        const flag = data[0].flags.svg;
        const country = data[0].name.official;
        const capital = data[0].capital[0];
        const population = data[0].population;
        const languages = Object.values(data[0].languages).join(', ');

        if(data.length > 10 && searchQuery !== '') {
            clearAllInfo();
            Notify.info("Too many matches found. Please enter a more specific name");
            return;
        }

        if(data.length > 1 && data.length < 11) {
            createCountriesListMarkup(data);
            return;
        }

        createCountryCardMarkup(flag, country, capital, population, languages);
        return data;
    })

    .catch(error => {
        clearAllInfo();
        Notify.failure("Oops, there is no country with that name");
    });    
};

function createCountriesListMarkup (data) {
    countriesListEl.classList.remove('is-hidden');
    clearAllInfo();
    
    const countriesListMarkup = data.map(el => `<li><h3 class="country-name"><svg width="40" height="40"><image href="${el.flags.svg}"
    width="40" height="40"/></svg>${el.name.official}</h3></li>`).join(' ');

    countriesListEl.insertAdjacentHTML('beforeend', countriesListMarkup);
};

function createCountryCardMarkup (flag, country, capital, population, languages) {
    countriesListEl.classList.add('is-hidden');
    clearAllInfo();

    countryCardEl.innerHTML = ` <h2 class="country-name"><svg width="40" height="40"><image href="${flag}"
    width="40" height="40"/></svg>
   ${country}</h2>
<p class="country-value"><span class="country-key">Capital: </span>${capital}</p> 
<p class="country-value"><span class="country-key">Population: </span>${population}</p> 
<p class="country-value"><span class="country-key">Languages: </span>${languages}</p>`;
}

function clearAllInfo () {
    countriesListEl.innerHTML = '';
    countryCardEl.innerHTML = '';
}
