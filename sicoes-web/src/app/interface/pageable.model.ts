export class Pageable<T> {
    content: [T]
    totalElements: number
    totalPages: number
    last: boolean
    first: boolean
    size: number
    number: number
    numberOfElements: number
}