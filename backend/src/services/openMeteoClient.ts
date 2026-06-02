import axios from 'axios';
import { WeatherData } from '../engine/scoringEngine';
import {
  OPEN_METEO_GEOCODING_BASE_URL,
  GEOCODING_SEARCH_ENDPOINT,
  OPEN_METEO_WEATHER_FORECAST_BASE_URL,
  WEATHER_DAILY_FORECAST_ENDPOINT
} from '../constants/api';

export interface LocationGeo {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

/**
 * Resolves free-form text input using the Open-Meteo Geocoding API
 */
export async function resolveLocation(query: string): Promise<LocationGeo> {
  const url = `${OPEN_METEO_GEOCODING_BASE_URL}${GEOCODING_SEARCH_ENDPOINT}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const response = await axios.get(url);
  
  if (!response.data.results || response.data.results.length === 0) {
    throw new Error(`Location '${query}' could not be resolved.`);
  }
  
  const { name, latitude, longitude, country } = response.data.results[0];
  return { name, latitude, longitude, country };
}

/**
 * Fetches required meteorological parameters for the next 7 days
 */
export async function fetch7DayForecast(lat: number, lon: number): Promise<WeatherData[]> {
  const url = `${OPEN_METEO_WEATHER_FORECAST_BASE_URL}${WEATHER_DAILY_FORECAST_ENDPOINT}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,snowfall_sum,wind_speed_10m_max&timezone=auto`;
  const response = await axios.get(url);
  const daily = response.data.daily;

  if (!daily || !daily.time) {
    throw new Error("Invalid response structural context returned from the Weather Forecast API.");
  }

  const results: WeatherData[] = [];
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