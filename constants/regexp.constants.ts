export const ENGLISH_LETTERS = RegExp('^[a-zA-Z]+$');
export const ENGLISH_LETTERS_AND_NUMBERS = RegExp('^[a-zA-Z0-9]+$');
export const ENGLISH_LETTERS_AND_SPACE = RegExp('^[a-zA-Z ]+$');
export const ENGLISH_LETTERS_AND_DOT = RegExp('^[a-zA-Z.]+$');
export const ENGLISH_LETTERS_WITH_NUMBERS_AND_LIMITED_SYMBOLS = RegExp('^[a-zA-Z0-9._]+$');
export const ENGLISH_LETTERS_WITH_NUMBERS_AND_SYMBOLS = RegExp('^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$');
export const GUID = RegExp('[a-fA-F\\d]{8}-[a-fA-F\\d]{4}-[a-fA-F\\d]{4}-[a-fA-F\\d]{4}-[a-fA-F\\d]{12}');
export const PHONE_NUMBER = RegExp('^[+]\\d{11}$');