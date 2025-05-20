export function getMoscowDateTime(): Date {
  const now = new Date();
  const mskOffset = 3 * 60 * 60 * 1000; //3ч.
  return new Date(now.getTime() + mskOffset);
}

export function toMoscowTime(date: Date): Date {
  const mskOffset = 3 * 60 * 60 * 1000;
  return new Date(date.getTime() + mskOffset);
}

export function fromMoscowTime(date: Date): Date {
  const mskOffset = 3 * 60 * 60 * 1000;
  return new Date(date.getTime() - mskOffset);
}