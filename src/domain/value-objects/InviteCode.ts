export class InviteCode {
  constructor(public readonly value: string) {
    if (!/^[A-Z0-9]{6}$/.test(value)) {
      throw new Error("Le code d'invitation doit faire exactement 6 caractères alphanumériques.");
    }
  }

  public toString(): string {
    return this.value;
  }
}
