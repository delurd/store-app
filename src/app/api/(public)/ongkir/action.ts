
export const fetchRajaOngkir = async (path = '', method: "GET" | "POST" = "GET", body?: BodyInit | null | undefined) => {
    //    console.log(body);
    return await fetch('https://api.rajaongkir.com/starter/' + path, {
        headers: {
            key: 'a32919a2bc56c147be936e71d57dc0f8',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method,
        body,
    }).then(async (res) => {
        if (!res.ok) throw res

        const json = await res.json()

        return json.rajaongkir
    })
}