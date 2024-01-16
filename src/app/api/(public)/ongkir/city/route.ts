
import { NextRequest, NextResponse } from "next/server";
import { fetchRajaOngkir } from "../action";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)

    const province = searchParams.get('proviceId') ? `province=${searchParams.get('proviceId')}` : ''
    const city = searchParams.get('cityId') ? `id=${searchParams.get('cityId')}` : ''
    const query = '?' + province + city

    return await fetchRajaOngkir('city' + query).then(res => {
        const results = res.results

        return NextResponse.json({ message: 'success', data: results })
    }).catch((err) => {

        return NextResponse.json({ message: 'Something went wrong' }, { status: 400 })
    })
}