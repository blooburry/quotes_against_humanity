export class IncorrectPasswordError extends Error {
    public constructor(override message: string) {
        super(message);
    }
}

export class UserNotFoundError extends Error {
    public constructor(override message: string) {
        super(message)
    }
}

export class PasswordIncorrectError extends Error {
    public constructor(override message: string) {
        super(message)
    }
}
