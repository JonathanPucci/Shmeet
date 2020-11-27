


export const getBodyWidth = (body: Matter.Body) => {
    return body.bounds.max.x - body.bounds.min.x
}

export const getBodyHeight = (body: Matter.Body) => {
    return body.bounds.max.y - body.bounds.min.y
}
