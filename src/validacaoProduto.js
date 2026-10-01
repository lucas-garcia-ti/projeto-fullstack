const quantidadeEstoqueValida = (quantidade) =>
    typeof quantidade === 'number' &&
    Number.isInteger(quantidade) &&
    quantidade >= 0;

const dataValidadeValida = (data) => {
    if (typeof data !== 'string') {
        return false;
    }

    const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);
    if (!partes) {
        return false;
    }

    const ano = Number(partes[1]);
    const mes = Number(partes[2]);
    const dia = Number(partes[3]);

    if (ano < 1 || mes < 1 || mes > 12) {
        return false;
    }

    const anoBissexto =
        ano % 400 === 0 || (ano % 4 === 0 && ano % 100 !== 0);
    const diasPorMes = [
        31, anoBissexto ? 29 : 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31
    ];

    return dia >= 1 && dia <= diasPorMes[mes - 1];
};

module.exports = { quantidadeEstoqueValida, dataValidadeValida };