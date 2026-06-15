export class Score {
  constructor(
    public readonly value: number,
    public readonly accuracy: number
  ) {
    if (value < 0) {
      throw new Error("La valeur du score ne peut pas être négative.");
    }
    if (accuracy < 0 || accuracy > 100) {
      throw new Error("La précision doit être comprise entre 0 et 100%.");
    }
  }

  public isPerfect(): boolean {
    return this.accuracy === 100;
  }
}
