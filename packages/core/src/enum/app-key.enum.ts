// ----- APP KEY STATUS -----

export enum EAppKeyStatus {
  ENABLED = 1,
  DISABLED = 2,

  /** `EXPIRED` is not a physical status, but a logical status, and only used in the frontend */
  EXPIRED = 3,
}
