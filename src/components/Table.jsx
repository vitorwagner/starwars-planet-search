import { useEffect, useState } from 'react';
import fetchPlanets from '../services/fetchPlanets';

const headers = ['Name', 'Rotation Period', 'Orbital Period', 'Diameter', 'Climate',
  'Gravity', 'Terrain', 'Surface Water', 'Population', 'Films', 'Created', 'Edited',
  'URL'];

function Table() {
  const [planets, setPlanets] = useState([]);
  const [nameQuery, setNameQuery] = useState('');

  const getPlanets = async () => {
    const planetsList = await fetchPlanets();
    setPlanets(planetsList);
    console.log(planetsList);
  };

  useEffect(() => {
    getPlanets();
  }, []);

  // const nameFilter = () => planets.filter((planet) => planet
  //   .toLowerCase().includes(nameQuery.toLowerCase()));

  // https://stackoverflow.com/questions/57358605/multiple-filters-in-react

  const filterPlanet = (data) => {
    // console.log(data.name);
    if (nameQuery && !data.name.toLowerCase().includes(nameQuery.toLowerCase())) return false;
    return true;
  };

  const filteredPlanets = planets.filter(filterPlanet);

  return (
    <div>
      <input
        value={ nameQuery }
        onChange={ (e) => setNameQuery(e.target.value) }
        type="search"
        data-testid="name-filter"
      />
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
