import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import responseData from './mocks/apiData';
import { act } from 'react-dom/test-utils';

const ASC = [  
  'Yavin IV', 'Tatooine',
  'Bespin',   'Endor',
  'Kamino',   'Alderaan',
  'Naboo',    'Coruscant',
  'Hoth',     'Dagobah'
];

const FILTERED = [  
  'Tatooine', 'Alderaan',
  'Yavin IV',   'Bespin',
  'Endor',   'Naboo',
  'Coruscant',    'Kamino',
];

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue(responseData)
})
});

describe('Testa o aplicativo', () => {
  test('Teste se os filtros aparecem', () => {
    render(<App />);
    const nameFilter = screen.getByTestId('name-filter');
    const columnFilter = screen.getByTestId('column-filter');
    const comparisonFilter = screen.getByTestId('comparison-filter');
    const valueFilter = screen.getByTestId('value-filter');
    const buttonFilter = screen.getByTestId('button-filter');
    const removeFilters = screen.getByTestId('button-remove-filters');

    expect(nameFilter).toBeInTheDocument();
    expect(columnFilter).toBeInTheDocument();
    expect(comparisonFilter).toBeInTheDocument();
    expect(valueFilter).toBeInTheDocument();
    expect(buttonFilter).toBeInTheDocument();
    expect(removeFilters).toBeInTheDocument();
  });

  test('Teste se o filtro de nome funciona', async () => {
    render(<App />);
    const nameFilter = screen.getByTestId('name-filter');
    userEvent.type(nameFilter, 'Naboo');

    const planet = await screen.findByText(/naboo/i, {}, {timeout: 5000})
    
    expect(planet).toBeInTheDocument()
  });
  test('Teste se a ordenação da tabela funciona', async () => {
    render(<App />);


    const columnSort = screen.getByTestId('column-sort');
    const buttonOrder = screen.getByTestId('column-sort-button');
    const inputDesc = screen.getByTestId('column-sort-input-desc');

    expect(columnSort).toBeInTheDocument();
    expect(buttonOrder).toBeInTheDocument();
    expect(inputDesc).toBeInTheDocument();

    const planet = await screen.findByText(/naboo/i, {}, {timeout: 5000})
    expect(planet).toBeInTheDocument()

    userEvent.selectOptions(columnSort, 'population');
    act(() => {
      userEvent.click(buttonOrder);
    });

    const planetNames = screen.getAllByTestId('planet-name');
    planetNames.forEach((names, index) => {
      expect(names.innerHTML).toBe(ASC[index]);
    })
  });

  test('Teste se os filtros funcionam', async () => {
    render(<App />);
    const planet1 = await screen.findByText(/naboo/i, {}, {timeout: 5000})
    expect(planet1).toBeInTheDocument()


    const buttonFilter = screen.getByTestId('button-filter');
    const comparisonFilter = screen.getByTestId('comparison-filter');
    const resetFilter = screen.getByTestId('button-remove-filters');


    act(() => {
      comparisonFilter.value = 'maior que';
      comparisonFilter.dispatchEvent(new Event('change'));
      userEvent.click(buttonFilter);
    });

    const planetNames = screen.getAllByTestId('planet-name');
    planetNames.forEach((names, index) => {
      expect(names.innerHTML).toBe(FILTERED[index]);
    })

    const removeBtn = screen.getByRole('button', {  name: /x/i});
    const planet = screen.queryByText(/hoth/i)
    expect(planet).not.toBeInTheDocument()

    act(() => {
      userEvent.click(removeBtn);
      userEvent.click(buttonFilter);
      userEvent.click(buttonFilter);
      userEvent.click(buttonFilter);
      userEvent.click(buttonFilter);
      userEvent.click(buttonFilter);
      
    })

    const planetNames2 = screen.getAllByTestId('planet-name');
    expect(planetNames2.length).toBe(10);

    act(() => userEvent.click(resetFilter))

    act(() => {
      comparisonFilter.value = 'maior que';
      comparisonFilter.dispatchEvent(new Event('change'));
      userEvent.click(buttonFilter);
    });

    act(() => {
      comparisonFilter.value = 'menor que';
      comparisonFilter.dispatchEvent(new Event('change'));
      userEvent.click(buttonFilter);
    });

    act(() => {
      userEvent.click(resetFilter);
    })

    act(() => {
      comparisonFilter.value = 'igual a';
      comparisonFilter.dispatchEvent(new Event('change'));
      userEvent.click(buttonFilter);
    });
  });
});
