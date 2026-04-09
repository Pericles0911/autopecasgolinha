const VALID_DDDS = new Set(['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99']);

const onlyDigits = (v = '') => String(v).replace(/\D/g, '');

function validateCNPJ(cnpj) {
  const s = onlyDigits(cnpj);
  if (s.length !== 14 || /^(\d)\1+$/.test(s)) return false;

  const calc = (t) => {
    let sum = 0, pos = t - 7;
    for (let i = 0; i < t; i++) {
      sum += s[i] * pos--;
      if (pos < 2) pos = 9;
    }
    const res = sum % 11;
    return res < 2 ? 0 : 11 - res;
  };

  return calc(12) === +s[12] && calc(13) === +s[13];
}

function validateGTIN(gtin) {
  const s = onlyDigits(gtin);
  if (![8, 12, 13, 14].includes(s.length)) return false;

  let sum = 0;
  for (let i = 0; i < s.length - 1; i++) {
    // Lógica de peso 3,1,3,1 vindo da direita para a esquerda
    const multiplier = ((s.length - 1 - i) % 2 === 0) ? 1 : 3;
    sum += s[i] * multiplier;
  }
  const calcCheck = (10 - (sum % 10)) % 10;
  return calcCheck === +s[s.length - 1];
}

function validatePhone(phone) {
  let s = onlyDigits(phone);
  if (s.startsWith('55') && s.length >= 12) s = s.slice(2);
  if (![10, 11].includes(s.length) || /^(\d)\1+$/.test(s)) return { valid: false };

  const ddd = s.slice(0, 2);
  const local = s.slice(2);
  if (!VALID_DDDS.has(ddd)) return { valid: false };

  if (s.length === 11 && local[0] !== '9') return { valid: false };
  if (s.length === 10 && [0, 1].includes(+local[0])) return { valid: false };

  return { valid: true, normalized: s };
}

module.exports = { onlyDigits, validateCNPJ, validateGTIN, validatePhone };
