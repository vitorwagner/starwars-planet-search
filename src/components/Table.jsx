import { useEffect, useState } from 'react';
import fetchPlanets from '../services/fetchPlanets';

const headers = ['Name', 'Rotation Period', 'Orbital Period', 'Diameter', 'Climate',
  'Gravity', 'Terrain', 'Surface Water', 'Population', 'Films', 'Created', 'Edited',
  'URL'];

function Table() {
  const [planets, setPlanets] = useState([]);
  const [nameQuery, setNameQuery] = useState('');
  const [filters, setFilters] = useState(['population', 'orbital_period',
    'diameter', 'rotation_period', 'surface_water']);
  const [activeFilters, setActiveFilters] = useState([]);

  const getPlanets = async () => {
    const planetsList = await fetchPlanets();
    setPlanets(planetsList);
  };

  useEffect(() => {
    getPlanets();
  }, []);

  const addFilter = (e) => {
    e.preventDefault();
    setActiveFilters((prevState) => [...prevState, {
      check: e.target.check.value,
      value: e.target.value.value,
      column: e.target.column.value,
    }]);
    setFilters((prevState) => prevState.filter((column) => column
    !== e.target.column.value));
  };

  const removeFilter = (e) => {
    setActiveFilters(activeFilters.filter((filter) => filter.column !== e.target.name));
    setFilters([...filters, e.target.name]);
  };

  // https://www.freecodecamp.org/news/how-to-convert-a-string-to-a-number-in-javascript/

  const numericCheck = ({ check, value, column }, data) => {
    if (data[column] === 'unknown') return false;
    switch (check) {
    case 'maior que':
      return +data[column] > +value;
    case 'menor que':
      return +data[column] < +value;
    case 'igual a':
      return +data[column] === +value;
    default:
      return true;
    }
  };

  const resetFilters = () => {
    setFilters(['population', 'orbital_period',
      'diameter', 'rotation_period', 'surface_water']);
    setActiveFilters([]);
  };

  // https://stackoverflow.com/questions/57358605/multiple-filters-in-react

  const filterPlanet = (data) => (data.name.toLowerCase()
    .includes(nameQuery.toLowerCase())
    && (activeFilters[0] ? numericCheck(activeFilters[0], data) : true)
    && (activeFilters[1] ? numericCheck(activeFilters[1], data) : true)
    && (activeFilters[2] ? numericCheck(activeFilters[2], data) : true)
    && (activeFilters[3] ? numericCheck(activeFilters[3], data) : true)
    && (activeFilters[4] ? numericCheck(activeFilters[4], data) : true)
  );

  const filteredPlanets = planets.filter(filterPlanet);

  return (
    <div>
      <input
        value={ nameQuery }
        onChange={ (e) => setNameQuery(e.target.value) }
        type="search"
        data-testid="name-filter"
      />
      <form onSubmit={ addFilter }>
        <select name="column" id="" data-testid="column-filter">
          {filters.map((item) => <option key={ item }>{item}</option>)}
        </select>
        <select name="check" id="" data-testid="comparison-filter">
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
        <input
          type="number"
          name="value"
          id=""
          data-testid="value-filter"
          defaultValue={ 0 }
        />
        <button type="submit" data-testid="button-filter">Adicionar Filtro</button>
      </form>
      <div>
        {activeFilters.map((filter) => (
          <div key={ filter.column } data-testid="filter">
            <span>{filter.column}</span>
            <span>{filter.check}</span>
            <span>{filter.value}</span>
            <button name={ filter.column } onClick={ removeFilter }>X</button>
          </div>
        ))}
      </div>
      <button data-testid="button-remove-filters" onClick={ resetFilters }>
        Remove all filters
      </button>
      <table>
        <caption>Planets</caption>
        <thead>
          <tr>
            {headers.map((header) => (<th key={ header }>{header}</th>))}
          </tr>
        </thead>
        <tbody>
          {filteredPlanets.map((item) => (
            <tr key={ item.name }>
              {Object.values(item).map((val) => (
                <td
                  key={ val }
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}

        </tbody>

      </table>
    </div>

  );
}

export default Table;
