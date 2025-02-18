import { ERole } from 'src/enum';

export interface OptionType<TValue = string> {
  label: string;
  value: TValue;
}

export interface RoleOption extends OptionType<ERole> {
  disabled: boolean;
}

export interface CertificationOption extends OptionType {}
