class ApiException implements Exception {
  int code;
  String? message;
  Exception? innerException;
  StackTrace? stackTrace;

  ApiException(
    { 
      this.code = 0, 
      this.message,
      this.innerException,
      this.stackTrace
    }
  );

  ApiException.withInner(
    this.code, 
    this.message, 
    this.innerException, 
    this.stackTrace
  );

  @override
  String toString() {
    if (message == null) return "ApiException";

    if (innerException == null) {
      return "ApiException $code: $message";
    }

    return "ApiException $code: $message (Inner exception: $innerException)\n\n$stackTrace";
  }
}