import { host } from "@/utils/variables"
import { useSession } from "next-auth/react";

export const useFetch = () => {
    const { data: session }: { data: any } = useSession();

    const fetchData = async (apiRoute = '', header = {}) => {
        return fetch(host + apiRoute, {
            headers: {
                // Accept: 'application/json',
                // 'Content-Type': 'application/json',
                ...header,

            },
        }).then((res) => {
            if (!res.ok) {
                throw res
            }
            return res;
        })
    }

    const fetchWithToken = async (apiRoute = '', method = 'GET', body?: BodyInit, header = {}) => {
        return fetch(host + apiRoute, {
            method,
            headers: {
                // Accept: 'application/json',
                // 'Content-Type': 'application/json',
                Authorization: session.user.id,
                ...header,
            },
            body
        }).then((res) => {
            if (!res.ok) {
                throw res
            }
            return res;
        })
    }

    return { fetchData, fetchWithToken }
}