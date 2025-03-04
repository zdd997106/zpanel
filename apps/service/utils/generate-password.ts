export function generatePassword(passwordLength: number): string {
  const characterSet =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+-.?<>{}~';

  let password = '';

  for (let i = 0, setLength = characterSet.length; i < passwordLength; ++i) {
    password += characterSet.charAt(Math.floor(Math.random() * setLength));
  }

  return password;
}
