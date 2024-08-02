/**
 * module state
 */

let state = {}

export function setState(options) {
    Object.assign(state, options)
}

/**
 * 获取
 * @param {string=} key
 * @returns {{}|*}
 */
export function getState(key) {
    if (key && key in state) {
        return state[key]
    }
    return state
}
