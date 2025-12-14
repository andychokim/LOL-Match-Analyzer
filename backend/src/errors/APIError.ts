// define APIError interface for error handling
export class APIError extends Error {
    status: number;
    statusText: string;

    constructor(status: number, statusText: string) {
        super(`${status}: ${statusText}`);
        this.status = status;
        this.statusText = statusText;
    }
}