export const TimeZoneOffsetHours = - new Date().getTimezoneOffset() / 60;
export const DefaultTimeZoneOffset = 3;

export class DateUtils {
    static now = (): Date => new Date();

    static lastHour = (val: Date | null | undefined): Date | undefined => val == null ? undefined : new Date(val.setHours(23, 59, 59, 999));

    static firstHour = (val: Date | null | undefined): Date | undefined => val == null ? undefined : new Date(val.setHours(0, 0, 0, 0));

    static deserialize = (val: Date | string | null | undefined): Date | null => {
        if (!val || (
            typeof val === 'string' &&
            val.includes('0001-01-01')
        )) {
            return null;
        }

        const parsed = new Date(val);
        if (typeof val === 'string' &&
            !val.includes('+') &&
            !val.toLowerCase().includes('z') &&
            val.toLowerCase().includes('t')
        ) {
            const utcHours = parsed.getHours() - DefaultTimeZoneOffset;
            parsed.setHours(utcHours + TimeZoneOffsetHours);
        }

        return isNaN(parsed.getFullYear()) ? null : parsed;
    }

    static serialize = (val: Date | string | null | undefined) => {
        if (typeof val === 'string') {
            return val;
        }

        return val == null || isNaN(val.getFullYear()) ? null : val.toISOString();
    }
}