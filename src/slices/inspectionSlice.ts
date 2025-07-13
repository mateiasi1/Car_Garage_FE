import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Inspection } from '../models/Inspection';

interface InspectionState {
  selectedInspection: Inspection | null;
}

const initialState: InspectionState = {
  selectedInspection: null,
};

export const inspectionSlice = createSlice({
  name: 'inspection',
  initialState,
  reducers: {
    setSelectedInspection(state, action: PayloadAction<Inspection | null>) {
      state.selectedInspection = action.payload;
    },
  },
});

export const { setSelectedInspection } = inspectionSlice.actions;

export default inspectionSlice.reducer;
