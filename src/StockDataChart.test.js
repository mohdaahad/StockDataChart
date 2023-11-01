import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import StockDataChart from './StockDataChart';

// Mock axios to simulate API requests
jest.mock('axios');

describe('StockDataChart', () => {
  it('renders loading spinner when data is not available', () => {
    render(<StockDataChart />);
    const loadingSpinner = screen.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('renders chart when data is available', async () => {
    // Mock the API response from axios
    const mockData = {
      data: {
        'Time Series (Daily)': {
          '2023-01-01': { '4. close': '100.00' },
          '2023-01-02': { '4. close': '101.00' },
          // Add more data as needed
        },
      },
    };
    axios.get.mockResolvedValue(mockData);

    render(<StockDataChart />);
    
    // Wait for the chart to be loaded
    await waitFor(() => {
      const chart = screen.getByTestId('stock-chart');
      expect(chart).toBeInTheDocument();
    });
  });

  it('changes interval on select change', async () => {
    const { container } = render(<StockDataChart />);
    const select = container.querySelector('.select-dropdown');

    // Simulate a select change to weekly
    fireEvent.change(select, { target: { value: 'weekly' } });

    // Wait for the chart to be updated with weekly data
    await waitFor(() => {
      const chart = screen.getByTestId('stock-chart');
      expect(chart).toBeInTheDocument();
    });
  });
});
