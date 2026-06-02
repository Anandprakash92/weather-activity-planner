# Engineering Omissions & Trade-offs

1. **Lack of a Distributed Caching Tier**
   - *Trade-off Justification*: Within the 2-3 hour implementation scope, Redis or local LRU cache configurations were omitted. In production environments, geo-coordinate resolution queries should be heavily cached to prevent unnecessary overhead and stay within Open-Meteo structural rate targets.
2. **Simplistic Parameter Linear Evaluation Models**
   - *Trade-off Justification*: The calculation engine assumes simple direct linear interpolation formulas for weather variables (e.g., wind/precipitation degradation multipliers). Complex composite configurations (like calculating wind chill indexes by binding temperature to wind factors concurrently) were skipped to keep the scoring pipeline maintainable and clean.
3. **Generic Calendar Presentation Placeholders**
   - *Trade-off Justification*: Days are outputting as sequence markers (`Day 1`, `Day 2`) inside the React container rather than localized relative calendar items (`Monday`, `Tuesday`). This isolates UI complexity and prioritizes the implementation of a resilient, highly scalable logic core.