"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLocation = resolveLocation;
exports.fetch7DayForecast = fetch7DayForecast;
const axios_1 = __importDefault(require("axios"));
const api_1 = require("../constants/api");
/**
 * Resolves free-form text input using the Open-Meteo Geocoding API
 */
async function resolveLocation(query) {
    const url = `${api_1.OPEN_METEO_GEOCODING_BASE_URL}${api_1.GEOCODING_SEARCH_ENDPOINT}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const response = await axios_1.default.get(url);
    if (!response.data.results || response.data.results.length === 0) {
        throw new Error(`Location '${query}' could not be resolved.`);
    }
    const { name, latitude, longitude, country } = response.data.results[0];
    return { name, latitude, longitude, country };
}
/**
 * Fetches required meteorological parameters for the next 7 days
 */
async function fetch7DayForecast(lat, lon) {
    const url = `${api_1.OPEN_METEO_WEATHER_FORECAST_BASE_URL}${api_1.WEATHER_DAILY_FORECAST_ENDPOINT}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,snowfall_sum,wind_speed_10m_max&timezone=auto`;
    const response = await axios_1.default.get(url);
    const daily = response.data.daily;
    if (!daily || !daily.time) {
        throw new Error("Invalid response structural context returned from the Weather Forecast API.");
    }
    const results = [];
    for (let i = 0; i < daily.time.length; i++) {
        results.push({
            temperature2mMax: daily.temperature_2m_max[i] ?? 20,
            precipitationSum: daily.precipitation_sum[i] ?? 0,
            snowfallSum: daily.snowfall_sum[i] ?? 0,
            windSpeed10mMax: daily.wind_speed_10m_max[i] ?? 0
        });
    }
    return results;
}
