import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

const StockMarketApp = () => {
	const [stockData, setStockData] = useState({});
	const apiKey = "pk_7a667a6422b8422a9052ac0034005ac0";
	const companies = ["AAPL", "MSFT", "TSLA", "AMZN", "META"];

	useEffect(() => {
		const fetchData = async () => {
			try {
				const stockData = {};

				for (const company of companies) {
					const response = await axios.get(
						`https://cloud.iexapis.com/stable/stock/${company}/chart/1m?token=${apiKey}`
					);

					if (response.data && Array.isArray(response.data)) {
						stockData[company] = response.data;
						console.log(response.data);
					} else {
						console.error("No data available for", company);
					}
				}

				setStockData(stockData);
			} catch (error) {
				console.error("Error fetching stock data:", error);
			}
		};

		fetchData(); // Fetch data on the first page load
	}, [apiKey, companies]);

	const renderChart = () => {
		if (!stockData || Object.keys(stockData).length === 0) {
			return <div>Loading...</div>;
		}

		const stockLabels = stockData[companies[0]].map(
			(entry) => new Date(entry.date)
		);

		if (!stockLabels || stockLabels.length === 0) {
			return <div>No stock data available.</div>;
		}

		const stockDatasets = companies.map((company) => ({
			label: company,
			data: stockData[company].map((entry) => entry.close),
		}));

		const chartData = {
			labels: stockLabels,
			datasets: stockDatasets,
		};

		const chartOptions = {
			scales: {
				x: {
					type: "time", // Use time scale for the x-axis
				},
				y: {
					type: "linear", // Use linear scale for the y-axis
				},
			},
			responsive: true,
			maintainAspectRatio: false,
		};

		return <Line data={chartData} options={chartOptions} />;
	};

	return (
		<div>
			<h1>Stock Market Data</h1>
			{renderChart()}
		</div>
	);
};

export default StockMarketApp;
