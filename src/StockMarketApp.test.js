import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import StockMarketApp from "./StockMarketApp";

// Mock Axios to simulate API calls
jest.mock("axios");

describe("StockMarketApp", () => {
	it("renders the component", async () => {
		render(<StockMarketApp />);
		expect(screen.getByText("Stock Market Data")).toBeInTheDocument();
	});

	it("fetches and displays stock data", async () => {
		// Mock Axios responses for API calls
		jest
			.spyOn(require("axios"), "get")
			.mockResolvedValueOnce({
				data: [
					{ date: "2023-01-01", close: 100 },
					{ date: "2023-01-02", close: 110 },
				],
			})
			.mockResolvedValueOnce({
				data: [
					{ date: "2023-01-01", close: 200 },
					{ date: "2023-01-02", close: 220 },
				],
			})
			.mockResolvedValueOnce({
				data: [
					{ date: "2023-01-01", close: 300 },
					{ date: "2023-01-02", close: 330 },
				],
			})
			.mockResolvedValueOnce({
				data: [
					{ date: "2023-01-01", close: 400 },
					{ date: "2023-01-02", close: 440 },
				],
			})
			.mockResolvedValueOnce({
				data: [
					{ date: "2023-01-01", close: 500 },
					{ date: "2023-01-02", close: 550 },
				],
			});

		render(<StockMarketApp />);

		// Wait for the data to be loaded
		await waitFor(() => {
			expect(screen.getByText("AAPL")).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(screen.getByText("MSFT")).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(screen.getByText("TSLA")).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(screen.getByText("AMZN")).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(screen.getByText("META")).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(screen.getByText("100")).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(screen.getByText("110")).toBeInTheDocument();
		});
	});
});
