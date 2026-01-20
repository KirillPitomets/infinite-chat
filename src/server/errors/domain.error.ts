export enum DomainErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  BAD_REQUEST = "BAD_REQUEST",
  FORBIDDEN = "FORBIDDEN",
  INTERNAL_SERVER = "INTERNAL_SERVER"
}

export const errorStatusMap: Record<DomainErrorCode, number> = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  CONFLICT: 409,
  INTERNAL_SERVER: 500
}

export abstract class DomainError extends Error {
  abstract readonly code: DomainErrorCode

  protected constructor(message: string) {
    super(message)
  }
}

export class UnauthorizedError extends DomainError {
  readonly code = DomainErrorCode.UNAUTHORIZED
  constructor() {
    super("Unauthorized")
  }
}

export class NotFoundError extends DomainError {
  readonly code = DomainErrorCode.NOT_FOUND
  constructor(entity: string) {
    super(`${entity} not found`)
  }
}

export class ConflictError extends DomainError {
  readonly code = DomainErrorCode.CONFLICT
  constructor(msg: string) {
    super(msg)
  }
}

export class BadRequest extends DomainError {
  readonly code = DomainErrorCode.BAD_REQUEST
  constructor(msg: string) {
    super(msg)
  }
}

export class ForbiddenError extends DomainError {
  readonly code = DomainErrorCode.FORBIDDEN
  constructor(msg: string) {
    super(msg)
  }
}

export class InternalServerError extends DomainError {
  readonly code = DomainErrorCode.INTERNAL_SERVER
  constructor(msg: string) {
    super(msg)
  }
}
