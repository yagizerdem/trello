class ApiResponse {
  success: boolean;
  errors: Array<string>;
  message: string;
  data: any;

  static fromJSON(json: any): ApiResponse {
    const instance = new ApiResponse();
    Object.assign(instance, json);
    return instance;
  }
}

export default ApiResponse;
