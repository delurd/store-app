export const statusShipping = (key: string) => {
    switch (key) {
        case 'pending':
            return {
                title: 'Waiting',
                color: 'text-grey-dark',
            };
        case 'shipping':
            return {
                title: 'Shipping',
                color: 'text-grey-dark',
            };
        case 'success':
            return {
                title: 'Success',
                color: 'text-success',
            };
        case 'canceled':
            return {
                title: 'Canceled',
                color: 'text-warning',
            };
        default:
            return {
                title: key,
                color: 'text-grey-dark',
            };
    }
};

export const statusShippingType = {
    pending: 'Pending',
    shipping: 'Shipping',
    success: 'Success',
    canceled: 'Canceled',
};