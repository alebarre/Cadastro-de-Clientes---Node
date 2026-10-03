"use strict";
/**
 * geradorCodigo.ts
 * Gera códigos numéricos para recuperação de senha.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarCodigoNumerico = gerarCodigoNumerico;
/**
 * gerarCodigoNumerico
 * Retorna um código numérico de 6 dígitos como string.
 */
function gerarCodigoNumerico(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
