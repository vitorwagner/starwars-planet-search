import { useEffect, useState } from 'react';
import fetchPlanets from '../services/fetchPlanets';

const headers = ['Name', 'Rotation Period', 'Orbital Period', 'Diameter', 'Climate',
  'Gravity', 'Terrain', 'Surface Water', 'Population', 'Films', 'Created', 'Edited',
  'URL'];

function Table() {
  const [planets, setPlanets] = useState([]);

  const getPlanets = async () => {
    const planetsList = await fetchPlanets();
    setPlanets(planetsList);
    console.log(planetsList);
  };

  useEffect(() => {
    getPlanets();
  }, []);

  const filterPlanet = () => true;

  const filteredPlanets = planets.filter(filterPlanet);

  return (
    <div>

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
