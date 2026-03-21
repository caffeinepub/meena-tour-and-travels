# Meena Tour and Travels

## Current State
Trip Route Guide has: origin city select, destination city select, shows highway route + distance + fixed avg fare (₹28/km) + range (₹25–₹35/km). Cities list has ~30 cities. No taxi type selector.

## Requested Changes (Diff)

### Add
- Taxi type selector in Trip Route Guide (after origin/destination selectors)
- Rate range per taxi type shown in result (not fixed rate)
- More North India cities/districts in the cities dropdown

### Modify
- Replace fixed avg fare display with per-vehicle rate range based on selected taxi type
- Cities list expanded with major North India districts

### Remove
- Fixed ₹28/km avg fare line (replace with taxi-type-based range)

## Implementation Plan
1. Add `routeTaxi` state variable (default empty)
2. Add taxi type selector dropdown with options: Sedan (₹18–22/km), Ertiga (₹22–28/km), Innova Crysta (₹35/km), Premium SUV (₹28–35/km), BMW / Mercedes (Contact for quote)
3. In the route result, show fare based on selected taxi type using distance * rate range
4. If BMW/Mercedes selected, show 'Contact for personalized quote: 9990104748' instead of a number
5. Expand cities list to include: Meerut, Aligarh, Moradabad, Bareilly, Saharanpur, Muzaffarnagar, Roorkee, Hapur, Bulandshahr, Firozabad, Etawah, Mainpuri, Rampur, Sambhal, Bijnor, Shamli, Kairana, Karnal, Panipat, Ambala, Kurukshetra, Sonipat, Rohtak, Hisar, Sirsa, Bhiwani, Ludhiana, Jalandhar, Amritsar, Pathankot, Jammu, Dharamshala, Dalhousie, Palampur, Kullu, Kasauli, Solan, Bilaspur (HP), Mandi, Rampur (HP), Spiti, Leh
