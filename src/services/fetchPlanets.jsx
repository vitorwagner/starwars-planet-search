const fetchPlanets = async () => {
  const response = await (await fetch('https://swapi.dev/api/planets')).json();
  return response.results.map(({ residents, ...item }) => item);
};

// https://stackoverflow.com/a/46839399

export default fetchPlanets;
