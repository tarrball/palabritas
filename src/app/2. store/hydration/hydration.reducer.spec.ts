import { hydrationReducer, initialState } from './hydration.reducer';

describe('HydrationReducer', () => {
  it('should return the initial state', () => {
    const result = hydrationReducer(undefined, { type: 'Unknown' });
    expect(result).toEqual(initialState);
  });
});