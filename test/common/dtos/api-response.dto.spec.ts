import { ApiResponse } from 'src/common/dtos/api-response.dto';

describe('ApiResponse', () => {
  it('should create a success response with data', () => {
    const data = { name: 'Test User' };
    const response = ApiResponse.success(data, 'Data loaded');

    expect(response.status).toBe('success');
    expect(response.message).toBe('Data loaded');
    expect(response.data).toEqual(data);
    expect(response.errors).toBeUndefined();
    expect(response.timestamp).toBeInstanceOf(Date);
  });

  it('should create a success response with default message', () => {
    const data = [1, 2, 3];
    const response = ApiResponse.success(data);

    expect(response.status).toBe('success');
    expect(response.message).toBe('Success');
    expect(response.data).toEqual(data);
  });

  it('should create an error response with message and errors', () => {
    const errors = ['Invalid email', 'Password too short'];
    const response = ApiResponse.error('Validation failed', errors);

    expect(response.status).toBe('error');
    expect(response.message).toBe('Validation failed');
    expect(response.errors).toEqual(errors);
    expect(response.data).toBeUndefined();
    expect(response.timestamp).toBeInstanceOf(Date);
  });

  it('should create an error response with default values', () => {
    const response = ApiResponse.error('Something went wrong');

    expect(response.status).toBe('error');
    expect(response.message).toBe('Something went wrong');
    expect(response.errors).toEqual([]);
  });
});
