import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const searchForm = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const clearForm = el => {
  el.innerHTML = '';
};

const createCountryList = countries => {
  clearForm(countryInfo);
  countryList.classList.remove('visually-hidden');
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class = "country-list-item">
        <img src="${flags.svg}" alt="${name.official}" width = "30" heigth = "30">
        <span>${name.official}</span>
      </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
};

const createCountryInfo = countries => {
  clearForm(countryList);
  countryList.classList.add('visually-hidden');

  const markup = countries.map(
    ({ flags, name, capital, population, languages }) => {
      return `<div class = "div-container">
        <img src="${flags.svg}" alt="${name.official}" width="30" height="30"/>
        <h2>${name.official}</h2>
      </div>
      <ul>
        <li class = "country-descr">
          <p class = "country-text">Capital:</p>
          <span>${capital}</span>
        </li>
        <li class = "country-descr">
          <p class = "country-text">Population:</p>
          <span>${population}</span>
        </li>
        <li class = "country-descr">
          <p class = "country-text">Languages:</p>
          <span>${Object.values(languages).join(', ')}</span>
        </li>
      </ul>`;
    }
  );
  countryInfo.innerHTML = markup;
};

const onSearchForm = e => {
  e.preventDefault();

  const nameCountry = e.target.value.trim();
  if (!nameCountry) {
    clearForm(countryInfo);
    clearForm(countryList);
    return;
  }

  fetchCountries(nameCountry)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        createCountryList(countries);
      } else {
        createCountryInfo(countries);
      }
    })
    .catch(error => {
      clearForm(countryInfo);
      clearForm(countryList);
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

searchForm.addEventListener('input', debounce(onSearchForm, DEBOUNCE_DELAY));
