interface IActionResponseSuccess<T> {
    success: true
    message: string
    data: T
}

interface IActionResponseFailed {
    success: false
    message: string
}

export type IActionResponse<T> = IActionResponseSuccess<T> | IActionResponseFailed

export type ActionResponse<T> = Promise<IActionResponse<T>>

