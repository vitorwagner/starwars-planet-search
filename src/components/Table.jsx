import fetchPlanets from '../services/fetchPlanets';

const headers = ['Name', 'Rotation Period', 'Orbital Period', 'Diameter', 'Climate',
  'Gravity', 'Terrain', 'Surface Water', 'Population', 'Films', 'Created', 'Edited',
  'URL'];

function Table() {
  const getPlanets = async () => {
    const planets = await fetchPlanets();
    console.log(planets);
  };

  getPlanets();

  return (
    <div>

      <div>
        <tr>
          {headers.map((header) => (<th key={ header }>{header}</th>))}
        </tr>
      </div>
    </div>

  );
}

export default Table;
