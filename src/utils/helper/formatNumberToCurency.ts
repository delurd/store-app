export const formatToCurency = (number: any) => {
    return new Intl.NumberFormat('de-DE').format(
        number
    )
}