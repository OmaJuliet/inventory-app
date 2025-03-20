import { FormApi } from './FormApi.js';
import { Validator } from './types.js';
import { DeepKeys } from './util-types.js';
type ArrayFieldMode = 'insert' | 'remove' | 'swap' | 'move';
export declare function metaHelper<TFormData, TFormValidator extends Validator<TFormData, unknown> | undefined = undefined>(formApi: FormApi<TFormData, TFormValidator>): {
    handleArrayFieldMetaShift: (field: DeepKeys<TFormData>, index: number, mode: ArrayFieldMode, secondIndex?: number) => void;
};
export {};
