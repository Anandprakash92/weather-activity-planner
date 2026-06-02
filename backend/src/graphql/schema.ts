import { createSchema } from 'graphql-yoga';
import { resolveLocation, fetch7DayForecast } from '../services/openMeteoClient';
import { calculateScores } from '../engine/scoringEngine';

export const schema = createSchema({
  typeDefs: `
    type ActivityRanking {
      activity: String!
      dailyScores: [Int!]!
      averageScore: Float!
    }

    type DestinationReport {
      cityName: String!
      country: String!
      rankings: [ActivityRanking!]!
    }

    type Query {
      getDestinationRankings(city: String!): DestinationReport!
    }
  `,
  resolvers: {
    Query: {
      getDestinationRankings: async (_parent, { city }: { city: string }) => {
        try {
          const location = await resolveLocation(city);
          const rawWeather = await fetch7DayForecast(location.latitude, location.longitude);
          const computedScores = calculateScores(rawWeather);

          const rankings = Object.entries(computedScores).map(([activity, dailyScores]) => {
            const averageScore = dailyScores.reduce((a, b) => a + b, 0) / dailyScores.length;
            return {
              activity,
              dailyScores,
              averageScore: parseFloat(averageScore.toFixed(1))
            };
          }).sort((a, b) => b.averageScore - a.averageScore); // Higher averages naturally bubble up

          return {
            cityName: location.name,
            country: location.country,
            rankings
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message || "Failed to compile destination metrics.");
          }
        }
      }
    }
  }
});