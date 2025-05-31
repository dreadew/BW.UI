export const PASSWORD_REQUIREMENTS = [
    { id: 'length', text: 'Минимум 8 символов', regex: /.{8,}/ },
    { id: 'uppercase', text: 'Хотя бы одна заглавная буква', regex: /[A-Z]/ },
    { id: 'lowercase', text: 'Хотя бы одна строчная буква', regex: /[a-z]/ },
    { id: 'number', text: 'Хотя бы одна цифра', regex: /[0-9]/ },
    { id: 'special', text: 'Хотя бы один специальный символ', regex: /[^A-Za-z0-9]/ }
];
  
export const PASSWORD_MIN_STRENGTH = 3;