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
 * @param {*=} default_val default value
 * @returns {{}|*}
 */
export function getState(key, default_val = '') {
    if (key && key in state) {
        return state[key]
    }
    if (default_val) {
        return default_val
    }
    return state
}
