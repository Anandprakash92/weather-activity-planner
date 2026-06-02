import { gql } from '@apollo/client';

export const GET_DESTINATION_RANKINGS = gql`
  query GetDestinationRankings($city: String!) {
    getDestinationRankings(city: $city) {
      cityName
      country
      rankings {
        activity
        dailyScores
        averageScore
      }
    }
  }
`;