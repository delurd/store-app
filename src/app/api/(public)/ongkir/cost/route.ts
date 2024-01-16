
import { NextRequest, NextResponse } from "next/server";
import { fetchRajaOngkir } from "../action";

type bodyParamType = {
    origin: string;
    destination: string;
    weight: number; //gram
    courier: 'jne' | 'pos' | 'tiki'
}

export const POST = async (req: NextRequest) => {
    const reqBody = await req.json()

    const weight = (reqBody?.weight ?? 500)
    const courier = 'jne'
    const body = `origin=${reqBody?.origin}&destination=${reqBody?.destination}&weight=${weight}&courier=${courier}`
    // console.log(body);

    return await fetchRajaOngkir('cost', 'POST', body).then(res => {
        const results = res.results
        // console.log(results[0].costs);

        return NextResponse.json({ message: 'success', data: results[0].costs[1].cost[0].value })
    }).catch((err) => {

        return NextResponse.json({ message: 'Something went wrong' }, { status: 400 })
    })
}