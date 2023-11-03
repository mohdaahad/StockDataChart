import React, { Component } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import './App.css';

class StockDataChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockData: [],
      interval: 'daily', // Default interval is daily
    };
  }

  componentDidMount() {
    this.fetchStockData(this.state.interval);
  }

  fetchStockData(interval) {
    const stockTickers = ['AAPL', 'MSFT', 'TSLA', 'AMZN', 'META'];
    const apiKey = 'YOUR_ALPHAVANTAGE_API_KEY'; // Replace with your API key

    // Define the Alpha Vantage API function based on the selected interval
    let apiFunction = 'TIME_SERIES_DAILY_ADJUSTED';
    if (interval === 'weekly') {
      apiFunction = 'TIME_SERIES_WEEKLY_ADJUSTED';
    } else if (interval === 'monthly') {
      apiFunction = 'TIME_SERIES_MONTHLY_ADJUSTED';
    } else if (interval === 'yearly') {
      apiFunction = 'TIME_SERIES_YEARLY_ADJUSTED';
    }

    // Fetch data for each stock ticker in parallel
    Promise.all(
      stockTickers.map((ticker) =>
        axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&outputsize=full&apikey=demo`
          // `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${ticker}&outputsize=full&apikey=${apiKey}`
        )
      )
    )
      .then((responses) => {
        const stockData = responses.map((response, index) => ({
          ticker: stockTickers[index],
          data: response.data['Time Series (Daily)'],
        }));
        this.setState({ stockData, interval });
      })
      .catch((error) => {
        console.error('Error fetching stock data:', error);
      });
  }

  render() {
    const { stockData, interval } = this.state;

    if (stockData.length === 0) {
      return  <div className="loading-spinner">
      <div className="spinner"></div>
    </div>;
    }

    // Convert the stock data into a format suitable for plotting
    const plotData = stockData.map((stock) => ({
      x: Object.keys(stock.data).reverse(), // Reverse to show the latest data on the right
      y: Object.values(stock.data)
        .reverse()
        .map((dailyData) => parseFloat(dailyData['4. close'])),
      type: 'scatter',
      mode: 'lines',
      name: stock.ticker,
    }));

    const chartLayout = {
      autosize: true,
      title: `Stock Prices (${interval.charAt(0).toUpperCase() + interval.slice(1)})`,
    };

    return (
      <div className="chart-container">
        <div className="interval-selector">
          <label>Interval:</label>
          <select
            className="select-dropdown"
            onChange={(e) => this.fetchStockData(e.target.value)}
            value={interval}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <Plot data={plotData} layout={chartLayout} useResizeHandler />
      </div>
    );
  }
}

export default StockDataChart;