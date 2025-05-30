export type FieldTransformer = (value: any) => any;

export type PrimitiveKeys<T> = {
    [K in keyof T]: T[K] extends Date | string | number | boolean | null | undefined ? K : never;
}[keyof T];
  
export type ObjectKeys<T> = {
    [K in keyof T]: T[K] extends object ? K : never;
}[keyof T];

export type TypedTransformers<T> = Partial<{
    [K in PrimitiveKeys<T> | ObjectKeys<T>]: FieldTransformer;
}>;