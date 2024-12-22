function pad(numero: number) {
    return numero < 10 ? `0${numero}` : `${numero}`;
}

export function formatarHora(dataString: string) {

    if (!dataString) return '';

    const data = new Date(dataString);

    if (Number.isNaN(data.getTime())) return '';

    const dia = pad(data.getDate());
    const mes = pad(data.getMonth() + 1); // Os meses começam em 0
    const ano = data.getFullYear();

    const horas = pad(data.getHours());
    const minutos = pad(data.getMinutes());


    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(email);
};
