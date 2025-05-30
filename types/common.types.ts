export interface Option {
  value: string | number;
  label: string;
}

export interface FormFieldProps {
  error?: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface DialogOptions {
  initialOpen?: boolean;
  fullScreen?: boolean;
  onClose?: () => void;
}

export interface DialogControlOptions {
  id: string;
  initialState?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onConfirm?: (data: any) => void;
}

export interface KeyOptions {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  repeat?: boolean;
  global?: boolean;
  keyup?: boolean;
}

export type KeyHandler = (ev: KeyboardEvent) => void;

export interface KeyBinding {
  keys: string[];
  handler: KeyHandler;
  options: KeyOptions;
}

export interface ConfirmationDialogProps {
  message: string;
  zIndex?: number;
}

export interface GrpcUserDto {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  photoPath: string;
  createdAt: string;
  modifiedAt?: string;
}