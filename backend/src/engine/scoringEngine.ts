/**
 * Core Scoring Engine
 * Uses the Strategy Pattern to evaluate and score activity profiles dynamically.
 * Scalable design allows adding new activities by adding an element to the ActivityRules map.
 */

export interface WeatherData {
    temperature2mMax: number;
    precipitationSum: number;
    snowfallSum: number;
    windSpeed10mMax: number;
  }
  
  export type ActivityType = 'SKIING' | 'SURFING' | 'OUTDOOR_SIGHTSEEING' | 'INDOOR_SIGHTSEEING';
  
  interface ScoreWeight {
    weight: number; // Sum of weights per activity must equal 1.0
    evaluate: (data: WeatherData) => number; // Outputs a raw sub-score from 0 to 100
  }
  
  // Declarative scoring rule configurations mapping strictly to the criteria
  const ActivityRules: Record<ActivityType, ScoreWeight[]> = {
    SKIING: [
      { weight: 0.5, evaluate: (w) => (w.snowfallSum > 5 ? 100 : w.snowfallSum * 20) },
      { weight: 0.5, evaluate: (w) => (w.temperature2mMax <= 0 ? 100 : Math.max(0, 100 - w.temperature2mMax * 10)) }
    ],
    SURFING: [
      { weight: 0.6, evaluate: (w) => (w.windSpeed10mMax >= 15 && w.windSpeed10mMax <= 30 ? 100 : Math.max(0, 100 - Math.abs(22 - w.windSpeed10mMax) * 4)) },
      { weight: 0.4, evaluate: (w) => Math.max(0, 100 - w.precipitationSum * 20) }
    ],
    OUTDOOR_SIGHTSEEING: [
      { weight: 0.4, evaluate: (w) => (w.temperature2mMax >= 18 && w.temperature2mMax <= 26 ? 100 : Math.max(0, 100 - Math.abs(22 - w.temperature2mMax) * 5)) },
      { weight: 0.4, evaluate: (w) => Math.max(0, 100 - w.precipitationSum * 25) },
      { weight: 0.2, evaluate: (w) => Math.max(0, 100 - w.windSpeed10mMax * 3) }
    ],
    INDOOR_SIGHTSEEING: [
      // Indoor alternatives score higher when bad weather impacts outdoor options
      { weight: 0.6, evaluate: (w) => Math.min(100, w.precipitationSum * 30) },
      { weight: 0.4, evaluate: (w) => (w.temperature2mMax < 10 || w.temperature2mMax > 30 ? 100 : 30) }
    ]
  };
  
  /**
   * Computes individual daily score variations for all configured activities over a 7-day period.
   */
  export function calculateScores(dailyData: WeatherData[]): Record<ActivityType, number[]> {
    const activities = Object.keys(ActivityRules) as ActivityType[];

    // Initialize result dynamically to support scalable additions of new activities
    const result = activities.reduce((acc, activity) => {
      acc[activity] = [];
      return acc;
    }, {} as Record<ActivityType, number[]>);
  
    for (const day of dailyData) {
      for (const activity of activities) {
        const rules = ActivityRules[activity];
        let totalScore = 0;
        
        for (const rule of rules) {
          totalScore += rule.evaluate(day) * rule.weight;
        }
        
        result[activity].push(Math.round(totalScore));
      }
    }
  
    return result;
  }