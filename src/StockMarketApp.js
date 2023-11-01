import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";

const StockMarketApp = () => {
	const [stockData, setStockData] = useState({});
	const apiKey = "pk_7a667a6422b8422a9052ac0034005ac0";
	const maxRequestsPerMinute = 200; // Variable depending on Rate Limit of API Used

	useEffect(() => {
		const companies = [
			{ symbol: "AAPL", color: "blue" },
			{ symbol: "MSFT", color: "green" },
			{ symbol: "TSLA", color: "red" },
			{ symbol: "AMZN", color: "purple" },
			{ symbol: "META", color: "orange" },
		];

		const interval = 60000 / maxRequestsPerMinute;

		const fetchData = async (company) => {
      try {
        //Data from IEX Cloud API
				const response = await axios.get(
					`https://cloud.iexapis.com/stable/stock/${company.symbol}/chart/1m?token=${apiKey}`
				);

				if (response.data && Array.isArray(response.data)) {
					return {
						company: company.symbol,
						color: company.color,
						data: response.data.map((entry) => ({
							date: entry.date,
							close: entry.close,
						})),
					};
				} else {
					console.error("No data available for", company.symbol);
					return null;
				}
			} catch (error) {
				console.error(
					"Error fetching stock data for",
					company.symbol,
					":",
					error
				);
				return null;
			}
		};

		const fetchAllData = async () => {
			const stockData = [];

			for (const company of companies) {
				console.log(`Fetching data for : ${company.symbol}`);
				const data = await fetchData(company);
				if (data) {
					stockData.push(data);
					console.log(data);
				}
				await new Promise((resolve) => setTimeout(resolve, interval));
			}

			setStockData(stockData);
		};

		fetchAllData();
	}, [apiKey, maxRequestsPerMinute]);

	return (
		<div>
			<h1>Stock Market Data</h1>
			{stockData.length > 0 ? (
				<ResponsiveContainer width="100%" height={400}>
					<LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
						<XAxis dataKey="date" />
						<YAxis />
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip />
						<Legend />

						{stockData.map((stock) => (
							<Line
								key={stock.company}
								type="monotone"
								dataKey="close"
								name={stock.company}
								stroke={stock.color}
								data={stock.data}
							/>
						))}
					</LineChart>
				</ResponsiveContainer>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default StockMarketApp;
