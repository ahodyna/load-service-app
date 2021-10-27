class ErrorHandler extends Error {
    constructor(status, customCode, data = "", message = "") {
        super(message);
        this.status = status;
        this.customCode = customCode;
        this.data = data

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;
