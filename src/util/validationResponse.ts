class ValidationResponse {
  success: boolean;
  errors: Array<string>;

  static create(isSuccess: boolean, errors: Array<string> = []) {
    const response = new ValidationResponse();
    response.success = isSuccess;
    response.errors = errors;
    return response;
  }
}

export default ValidationResponse;
