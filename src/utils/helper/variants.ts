export const varianType = {
    hidden: 'hidden',
    show: 'show'
}

export const varianFadeUpListContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};
export const varianFadeUpListItem = {
    hidden: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
};

export const varianOpacityListContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export const varianOpacityListItem = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
}
