import React from 'react';
import {
  Paper,
  Typography,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  Slider,
} from '@mui/material';

const PreferencesForm = React.memo(({
  preferences,
  onPreferenceChange,
  onSliderChange,
  formattedRentRange,
  isLoading
}) => {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Define Ideal Tenant Preferences</Typography>

      <FormGroup>
        {/* Rent Range Slider */}
        <Typography gutterBottom sx={{ mt: 2 }}>Desired Monthly Rent Range:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ minWidth: '70px' }}>{formattedRentRange.min}</Typography>
          <Slider
            name="rentRange"
            value={preferences.rentRange}
            onChange={onSliderChange}
            valueLabelDisplay="auto"
            valueLabelFormat={value => `$${value}`}
            min={500}
            max={10000}
            step={100}
            sx={{ mx: 1 }}
            disabled={isLoading}
          />
          <Typography sx={{ minWidth: '70px' }}>{formattedRentRange.max}</Typography>
        </Box>

        {/* Switches for Boolean Preferences */}
        <FormControlLabel
          control={
            <Switch
              checked={preferences.petFriendly}
              onChange={onPreferenceChange}
              name="petFriendly"
              disabled={isLoading}
            />
          }
          label="Pets Allowed"
          sx={{ mt: 1 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={preferences.smokingAllowed}
              onChange={onPreferenceChange}
              name="smokingAllowed"
              disabled={isLoading}
            />
          }
          label="Smoking Allowed"
        />
        <FormControlLabel
          control={
            <Switch
              checked={preferences.parkingRequired}
              onChange={onPreferenceChange}
              name="parkingRequired"
              disabled={isLoading}
            />
          }
          label="Requires Parking"
        />
        <FormControlLabel
          control={
            <Switch
              checked={preferences.furnishedRequired}
              onChange={onPreferenceChange}
              name="furnishedRequired"
              disabled={isLoading}
            />
          }
          label="Requires Furnished"
        />

        {/* Text Fields for Numeric/String Preferences */}
        <TextField
          label="Minimum Lease Duration (Months)"
          name="leaseDurationMonths"
          type="number"
          value={preferences.leaseDurationMonths}
          onChange={onPreferenceChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          disabled={isLoading}
          inputProps={{ min: "1" }}
        />
        <TextField
          label="Maximum Occupants"
          name="maxOccupants"
          type="number"
          value={preferences.maxOccupants}
          onChange={onPreferenceChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          disabled={isLoading}
          inputProps={{ min: "1" }}
        />
        <TextField
          label="Minimum Credit Score (Optional)"
          name="minCreditScore"
          type="number"
          value={preferences.minCreditScore}
          onChange={onPreferenceChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          disabled={isLoading}
          inputProps={{ min: "300", max: "850" }}
        />

        {/* Utilities Section */}
        <Typography gutterBottom sx={{ mt: 2 }}>Utilities Included:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={preferences.utilitiesIncluded.water}
                onChange={onPreferenceChange}
                name="utilitiesIncluded.water"
                disabled={isLoading}
              />
            }
            label="Water"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={preferences.utilitiesIncluded.gas}
                onChange={onPreferenceChange}
                name="utilitiesIncluded.gas"
                disabled={isLoading}
              />
            }
            label="Gas"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={preferences.utilitiesIncluded.electricity}
                onChange={onPreferenceChange}
                name="utilitiesIncluded.electricity"
                disabled={isLoading}
              />
            }
            label="Electricity"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={preferences.utilitiesIncluded.internet}
                onChange={onPreferenceChange}
                name="utilitiesIncluded.internet"
                disabled={isLoading}
              />
            }
            label="Internet"
          />
        </Box>

        {/* Laundry Type */}
        <TextField
          label="Laundry Availability"
          name="laundryType"
          value={preferences.laundryType}
          onChange={onPreferenceChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          disabled={isLoading}
          helperText="Specify laundry situation (e.g., In-Unit, Shared, None)"
        />

        {/* Notes */}
        <TextField
          label="Other Preferences/Notes"
          name="notes"
          value={preferences.notes}
          onChange={onPreferenceChange}
          multiline
          rows={3}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={isLoading}
          placeholder="e.g., No loud parties, specific move-in date requirements..."
        />
      </FormGroup>
    </Paper>
  );
});

PreferencesForm.displayName = 'PreferencesForm';

export default PreferencesForm; 