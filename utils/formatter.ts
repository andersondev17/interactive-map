export const Formatter = () => ({
    currency: (value: number) => new Intl.NumberFormat('es-CO').format(value),
    number: (value: number, decimals = 2) => value.toFixed(decimals)
});