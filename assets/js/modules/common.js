/**
 * module common
 */

import { initArea, elWorkArea, elFinalImage, elQuality } from "./elements.js"
import { getState, setState } from "./state.js"

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
 * @param {boolean=} png force png format
 * @returns {string}
 */
export function getDataURL(canvas, png = false) {
    let imageType = getState('type', 'image/png')
    if (png) {
        imageType = 'image/png'
    }
    return canvas.toDataURL(imageType, 1)
}

/**
 * 图片生成
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement} elimg
 */
export function setImage(canvas, elimg) {
    const imageType = getState('type')
    const quality = getState('quality')
    if (quality == 1) {
        elimg.setAttribute('src', getDataURL(canvas))
        return
    }
    if (imageType === 'image/png') {
        canvas.toBlob(blob => {
            const reader = new FileReader()
            reader.onload = () => {
                const pngQuality = Math.floor(255 * quality)
                const upngFrames = UPNG.toRGBA8(UPNG.decode(reader.result))
                const outputArrayBuff = UPNG.encode(upngFrames, canvas.width, canvas.height, pngQuality)
                const newBlob = new Blob([outputArrayBuff], {type: imageType})
                elimg.setAttribute('src', URL.createObjectURL(newBlob))
            }
            reader.readAsArrayBuffer(blob)
        })
    } else {
        const imageDataURL = canvas.toDataURL(imageType, quality)
        elimg.setAttribute('src', imageDataURL)
    }
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
    menu.style.display = menu.style.display === 'block'? 'none': 'block'

    if (document.querySelector('.scale-menu').style.display !== 'none') {
        elFinalImage.style.width = 'auto'
        elFinalImage.style.height = 'auto'
        elFinalImage.style.objectFit = 'none'
    } else {
        elFinalImage.style.width = '100%'
        elFinalImage.style.height = '100%'
        elFinalImage.style.objectFit = 'contain'
    }
}

export function download() {
    const image = elFinalImage.getAttribute('src')
    const downloadLink = document.createElement('a')
    downloadLink.download = Date.now()
    downloadLink.href = image
    const clickEvent = document.createEvent('MouseEvents')
    clickEvent.initMouseEvent('click', false, false)
    downloadLink.dispatchEvent(clickEvent)
}
