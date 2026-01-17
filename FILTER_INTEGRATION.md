# Filter Integration Guide

## Overview

This document explains how filter parameters have been integrated into the experiences system.

## Approach

### 1. **Database Schema** ✅
- Filter fields have been added to the `Experience` model:
  - `activityTypes`: ActivityType[] (array enum)
  - `timeOfDays`: TimeOfDay[] (array enum)
  - `duration`: Duration? (optional enum)
  - `specials`: Special[] (array enum)

### 2. **API Endpoints** ✅
- **POST /api/experiences**: Now accepts optional filter fields
- **PUT /api/experiences/[id]**: Now accepts optional filter fields for updates
- Filter fields are automatically mapped from display strings to enum values

### 3. **Backward Compatibility**
- Existing experiences without filter fields will have empty arrays/null values
- When no filters are applied, all experiences are shown (including those without filter fields)
- When filters ARE applied, only experiences matching the filter criteria are shown
- Experiences without filter fields won't match any filter criteria

### 4. **Population Script** ✅
Created a script to intelligently populate existing experiences with filter values:

```bash
npm run db:populate-filters
```

The script:
- Infers `activityTypes` from title/description keywords (e.g., "wine" → ART_AND_CULTURE, FOOD_AND_DRINK)
- Infers `timeOfDays` from keywords (e.g., "morning" → MORNING)
- Infers `duration` from duration keywords (e.g., "2h" → ONE_TO_4H)
- Infers `specials` from price and rating (e.g., high rating → LIKELY_TO_SELL_OUT)

## Migration Steps

### Step 1: Run Database Migration
```bash
npm run db:generate
npm run db:push
```

### Step 2: Populate Existing Experiences
```bash
npm run db:populate-filters
```

This will automatically populate filter fields for all existing experiences that don't have them.

### Step 3: (Optional) Re-seed Database
```bash
npm run db:seed
```

This will create new sample experiences with filter fields already populated.

## How Filtering Works

### When NO filters are applied:
- Shows ALL experiences (including those with empty filter fields)
- Uses price range filter if set (default: 0 to 1000)

### When filters ARE applied:
- Only shows experiences that match ALL applied filter criteria
- Experiences with empty filter fields won't match filter criteria
- Multiple selections within the same filter category use OR logic (e.g., "Arts & culture" OR "Tours")
- Different filter categories use AND logic (e.g., "Arts & culture" AND "Morning")

## Future Enhancements

Consider:
1. Adding filter fields to the ExperienceForm so hosts can set them when creating experiences
2. Adding an edit form for hosts to update filter fields
3. Adding a bulk update feature for hosts to update multiple experiences at once
4. Creating an admin panel to manage and update filter fields

## Current Status

✅ Database schema updated
✅ API endpoints accept filter fields
✅ Filter population script created
✅ Seed file updated with filter fields
✅ Filtering logic implemented in API

⏳ Form integration (can be added later)
⏳ Edit functionality for filter fields (can be added later)
