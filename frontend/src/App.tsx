import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DESTINATION_RANKINGS } from './graphql/queries';

export default function App() {
  const [searchCity, setSearchCity] = useState('');
  const [activeCity, setActiveCity] = useState('');

  const { loading, error, data } = useQuery(GET_DESTINATION_RANKINGS, {
    variables: { city: activeCity },
    skip: !activeCity,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setActiveCity(searchCity.trim());
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '50px auto', padding: '0 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#333' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.025em' }}>7-Day Desirability Dashboard</h1>
        <p style={{ color: '#666', margin: 0, fontSize: '1.1rem' }}>Data-driven ranking evaluation engine mapped to active weather variations.</p>
      </header>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
        <input
          type="text"
          placeholder="Search destination town/city (e.g., Chamonix, Maui, Tokyo)..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          style={{ flex: 1, padding: '14px 16px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '14px 28px', cursor: 'pointer', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '16px', transition: 'background 0.2s' }}>
          Analyze Destination
        </button>
      </form>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p style={{ fontSize: '1.2rem' }}>Resolving geospatial bounds and processing weather rules matrices...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '6px', marginBottom: '20px' }}>
          <strong>Execution Failure:</strong> {error.message}
        </div>
      )}

      {data?.getDestinationRankings && (
        <div>
          <div style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '12px', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>
              Results for {data.getDestinationRankings.cityName}, <span style={{ color: '#666' }}>{data.getDestinationRankings.country}</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {data.getDestinationRankings.rankings.map((r: any) => (
              <div key={r.activity} style={{ border: '1px solid #eaeaea', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <strong style={{ fontSize: '20px', letterSpacing: '-0.01em', textTransform: 'capitalize' }}>
                    {r.activity.toLowerCase().replace('_', ' ')}
                  </strong>
                  <span style={{ padding: '6px 12px', background: '#eef2ff', borderRadius: '20px', color: '#4f46e5', fontWeight: 700, fontSize: '14px' }}>
                    Composite Score: {r.averageScore}%
                  </span>
                </div>
                
                <div>
                  <span style={{ color: '#666', display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>7-Day Score Progression:</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {r.dailyScores.map((score: number, idx: number) => {
                      const color = score > 75 ? '#2f855a' : score > 45 ? '#dd6b20' : '#c53030';
                      const bg = score > 75 ? '#f0fff4' : score > 45 ? '#fffaf0' : '#fff5f5';
                      return (
                        <div key={idx} style={{ flex: 1, textAlign: 'center', background: bg, border: `1px solid ${bg}`, padding: '10px 4px', borderRadius: '6px', fontSize: '12px' }}>
                          <span style={{ color: '#718096', display: 'block', marginBottom: '4px' }}>Day {idx + 1}</span>
                          <div style={{ fontWeight: 800, fontSize: '16px', color: color }}>{score}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}