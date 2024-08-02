/**
 * module common
 */

import { initArea, elWorkArea } from "./elements.js"
import { getState } from "./state.js"

/**
 * 上传源图片
 * @param {object} options
 * @param {File} options.file
 * @param {function} options.callback
 */
export function upload(options) {
    initArea.style.display = 'none'
    elWorkArea.style.display = 'flex'
    const file = options.file
    if (!isImage(file)) {
        throw new Error('invalid image')
    }
    const fileReader = new FileReader()
    fileReader.onload = () => {
        const img = new Image()
        img.src = fileReader.result
        img.onload = () => {
            if (typeof options.callback === 'function') {
                options.callback.call(null, img)
            }
        }
    }
    fileReader.readAsDataURL(file)
}

/**
 * 图片验证
 * @param {File} file
 */
export function isImage(file) {
    if (!'type' in file) {
        return false
    }
    const type = file.type
    const validTypes = [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp'
    ]
    return validTypes.includes(type)

}

/**
 * 从 canvas 对象获取图片base64
 * @param {HTMLCanvasElement} canvas
 * @returns {string}
 */
export function getDataURL(canvas) {
    return canvas.toDataURL('png', 0.7)
}

/**
 * 初始化源图片
 */
export function drawSourceImage() {
    const sourceImage = getState('sourceImage')
    if (sourceImage) {
        const canvas = getState('canvas')
        const context = getState('context')
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height)
    } else {
        throw new Error('source image is not existed')
    }
}

/**
 * 打开/关闭菜单
 * @param {string} currentSelector
 */
export function toggleMenu(currentSelector) {
    const menu = document.querySelector(currentSelector)
    document.querySelectorAll('.menu-item').forEach((el) => {
        if (menu === el) {
            return
        }
        el.style.display = 'none'
    })
    console.log(menu)
    menu.style.display = menu.style.display === 'block'? 'none': 'block'
}
