export const UPDATE = 'UPDATE';

export interface Iupdate {
    type: string,
    text: string
}

export function update(text: string): Iupdate {
    return {
        text,
        type: UPDATE
    }
}