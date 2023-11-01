import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

const StockMarketApp = () => {
	const [stockData, setStockData] = useState(null);
	const apiKey = "PJ8S8G4FXMPX85QF";

  useEffect(() => {
		// Array of companies
		const companies = ["AAPL", "MSFT", "TSLA", "AMZN", "META"];
		const fetchData = async () => {
			try {
				const stockData = {};

				for (const company of companies) {
					const response = await axios.get(
						`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${company}&interval=5min&apikey=${apiKey}`
					);
          console.log(response.data);
					stockData[company] = response.data;
				}

				setStockData(stockData);
			} catch (error) {
				console.error("Error fetching stock data:", error);
			}
		};

		fetchData(); // Fetch data on the first page load
	}, [apiKey]); // Dependencies for useEffect remain unchanged

	const renderChart = () => {
		if (!stockData) {
			return <div>Loading...</div>;
		}

		if (!stockData["Time Series (Daily)"]) {
			return <div>No stock data available.</div>;
		}

		const stockLabels = Object.keys(stockData["Time Series (Daily)"]);
		const stockValues = Object.values(stockData["Time Series (Daily)"]).map(
			(entry) => entry["1. open"]
		);

		const chartData = {
			labels: stockLabels,
			datasets: [
				{
					label: "AAPL",
					data: stockValues.map((entry) => entry.AAPL),
					borderColor: "rgba(75, 192, 192, 1)",
					fill: false,
				},
				{
					label: "MSFT",
					data: stockValues.map((entry) => entry.MSFT),
					borderColor: "rgba(192, 75, 75, 1)",
					fill: false,
				},
				{
					label: "TSLA",
					data: stockValues.map((entry) => entry.TSLA),
					borderColor: "rgba(75, 75, 192, 1)",
					fill: false,
				},
				{
					label: "AMZN",
					data: stockValues.map((entry) => entry.AMZN),
					borderColor: "rgba(192, 192, 75, 1)",
					fill: false,
				},
				{
					label: "META",
					data: stockValues.map((entry) => entry.META),
					borderColor: "rgba(192, 75, 192, 1)",
					fill: false,
				},
			],
		};

		const options = {
			responsive: true,
			maintainAspectRatio: false,
		};

		return <Line data={chartData} options={options} />;
	};

	return (
		<div>
			<h1>Stock Market Data</h1>
			{renderChart()}
		</div>
	);
};

export default StockMarketApp;
