
const { validateCNPJ, validateGTIN } = require('../../src/services/checks');

describe('Validações CNPJ', () => {
  test('CNPJ válido deve retornar true', () => {

    expect(validateCNPJ('11444777000161')).toBe(true); // exemplo real
    expect(validateCNPJ('11.444.777/0001-61')).toBe(true);
  });

  test('CNPJ inválido deve retornar false', () => {
    expect(validateCNPJ('00000000000000')).toBe(false);
    expect(validateCNPJ('11444777000162')).toBe(false); // dígito errado
    expect(validateCNPJ('123')).toBe(false);
  });
});

describe('Validações GTIN', () => {
  test('GTIN-13 válido deve retornar true', () => {
    expect(validateGTIN('7891234567895')).toBe(true); // exemplo GTIN-13
  });

  test('GTIN-8 válido deve retornar true', () => {
    expect(validateGTIN('96385074')).toBe(true); // exemplo GTIN-8
  });

  test('GTIN inválido deve retornar false', () => {
    expect(validateGTIN('7891234567890')).toBe(false); // dígito errado
    expect(validateGTIN('123')).toBe(false);
    expect(validateGTIN('abcdefgh')).toBe(false);
  });

  test('GTIN-12 (UPC) válido', () => {
    expect(validateGTIN('036000291452')).toBe(true); // exemplo UPC-A
  });
});
