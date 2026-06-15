import { DomainError } from "./DomainError";

export class InvalidSessionError extends DomainError {
  constructor(message: string = "L'état de la session de quiz est invalide ou expiré.") {
    super(message);
    this.name = "InvalidSessionError";
  }
}
