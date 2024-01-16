
import { NextRequest, NextResponse } from "next/server";
import { fetchRajaOngkir } from "../action";

export const GET = async (req: NextRequest) => {
    return await fetchRajaOngkir('province').then(res => {
        const results = res.results

        return NextResponse.json({ message: 'success', data: results })
    }).catch((err) => {

        return NextResponse.json({ message: 'Something went wrong' }, { status: 400 })
    })
}