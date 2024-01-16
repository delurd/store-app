import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient()


export const generateRandomId = (aditional = "") => {

    const rand1 = Math.random().toString(36).substring(2, 10);
    const rand2 = Math.random().toString(36).substring(2, 10);

    const result = `${Date.now()}-${rand1}-${rand2}-${Math.round(
        Math.random() * 1000000
    )}${aditional}`;

    return (result);
}

export const generateCustomId = (jumlah = 1) => {
    let result = ''

    for (let i = 0; i < jumlah; i++) {
        result += Math.random().toString(36).substring(2, 9)
    }

    return result
}