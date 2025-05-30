import type { FieldTransformer } from "~/types/transformers.types";

export const fieldTransformers = {
    toDate: ((value: string | null | undefined): Date | null => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }) as FieldTransformer,
      
    toBoolean: ((value: string | boolean | number | null | undefined): boolean => {
        if (typeof value === 'boolean') return value;
        if (value === null || value === undefined) return false;
        if (typeof value === 'number') return value !== 0;
        return ['true', 'yes', '1', 'y'].includes(value.toLowerCase());
    }) as FieldTransformer,
      
    toNumber: ((value: string | number | null | undefined): number | null => {
        if (typeof value === 'number') return value;
        if (!value) return null;
        const num = Number(value);
        return isNaN(num) ? null : num;
    }) as FieldTransformer
}