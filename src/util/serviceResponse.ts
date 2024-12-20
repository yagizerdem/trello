class ServiceResponse {
  success: boolean;
  errors: Array<string>;
  data: any;

  static create(
    isSuccess: boolean,
    errors: Array<string> = [],
    data: any = null
  ) {
    const response = new ServiceResponse();
    response.success = isSuccess;
    response.errors = errors;
    response.data = data;
    return response;
  }
}

export default ServiceResponse;
