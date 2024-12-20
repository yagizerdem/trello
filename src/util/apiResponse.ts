class ApiResponse {
  success: boolean;
  errors: Array<string>;
  message: string | null;
  data: any;
  isAuthenticted: boolean;
  redirect: string | null;

  static fromJSON(json: any): ApiResponse {
    const instance = new ApiResponse();
    Object.assign(instance, json);
    return instance;
  }
  static create(
    success: boolean,
    errors: Array<string>,
    message: string | null = null,
    data: any = null,
    isAuthenticted: boolean = false,
    redirect: string = ""
  ) {
    const apiResponse = new ApiResponse();
    apiResponse.data = data;
    apiResponse.message = message;
    apiResponse.success = success;
    apiResponse.errors = errors;
    apiResponse.isAuthenticted = isAuthenticted;
    apiResponse.redirect = redirect;
    return apiResponse;
  }
}

export default ApiResponse;
