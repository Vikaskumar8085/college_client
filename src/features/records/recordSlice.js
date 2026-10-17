import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchRecords = createAsyncThunk(
  "records/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/records");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to fetch records",
      );
    }
  },
);

export const createRecord = createAsyncThunk(
  "records/create",
  async (recordData, thunkAPI) => {
    try {
      const response = await API.post("/records", recordData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to create record",
      );
    }
  },
);

export const updateRecord = createAsyncThunk(
  "records/update",
  async ({ id, recordData }, thunkAPI) => {
    try {
      const response = await API.put(`/records/${id}`, recordData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to update record",
      );
    }
  },
);

export const deleteRecord = createAsyncThunk(
  "records/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/records/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to delete record",
      );
    }
  },
);

const recordSlice = createSlice({
  name: "records",
  initialState: { records: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.records = action.payload;
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.records.push(action.payload);
      })
      .addCase(updateRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => r._id === action.payload._id,
        );
        if (index !== -1) state.records[index] = action.payload;
      })
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.records = state.records.filter((r) => r._id !== action.payload);
      });
  },
});

export default recordSlice.reducer;
