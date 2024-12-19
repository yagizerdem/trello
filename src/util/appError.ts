class AppError {
  isCritical: boolean;
  errorMessages: Array<string>;

  static create(
    isCritical: boolean,
    errorMessages: Array<string> | null = null
  ) {
    const appError: AppError = new AppError();
    appError.isCritical = isCritical;
    appError.errorMessages = errorMessages != null ? errorMessages : [];
    return appError;
  }
}

export default AppError;
