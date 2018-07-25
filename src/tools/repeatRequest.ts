import { sleep } from './wait';

export async function repeatRequest<T>(
    valueCallback: (() => T) | (() => Promise<T>),
    maxNumberOfAttempts: number = 100,
    firstAttemptDuration = 10,
): Promise<T> {
    let attemptDuration = firstAttemptDuration;
    for (let attempt = 0; attempt < maxNumberOfAttempts; attempt++) {
        try {
            const value = await valueCallback();
            return value;
        } catch (error) {
            attemptDuration *= 2;
            console.warn(
                `${error.message} Trying again after ${attemptDuration /
                    1000}s.`,
            );
            await sleep(attemptDuration);
        }
    }
    throw new Error(`Can not get value after ${maxNumberOfAttempts} attempts.`);
}
