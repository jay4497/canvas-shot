/**
 * module watermark
 */

import { getDataURL, drawSourceImage, isImage } from "./common.js"
import * as Els from './elements.js'
import { getState } from "./state.js"

let watermarkSource = null
let watermarkSourceWidth
let watermarkSourceHeight

/**
 * 水印更新
 */
export function watermarkUpdate() {
    const { canvas, context } = getState()
    const text = Els.elWatermarkText.value.trim()
    const position = Els.elWatermarkPosition.value
    const fontSize = Els.elWatermarkFontSize.value || 16
    if (text.length === 0) {
        return
    }

    drawSourceImage()
    context.font = fontSize + 'px "Microsoft YaHei",sans-serif'
    const textWidth = context.measureText(text).width
    let _x = 10, _y = parseInt(fontSize) + 10
    let points = []
    if (position == 1) {
        _x = canvas.width - 10 - textWidth
    }
    if (position == 2) {
        _y = canvas.height - 10
    }
    if (position == 3) {
        _x = canvas.width - 10 - textWidth
        _y = canvas.height - 10
    }
    if (position == 4) {
        _x = canvas.width / 2 - (textWidth / 2)
        _y = canvas.height / 2 - (fontSize / 2)
    }
    if (position == 5) {
        let _flag = true
        _x = -canvas.width / 2
        _y = -canvas.height / 2
        while (_y < canvas.height + (canvas.height / 2)) {
            points.push({
                _x,
                _y
            })
            _x += 50 + parseInt(textWidth)
            if (_x >= canvas.width + (canvas.width / 2)) {
                _y += 100 + parseInt(fontSize)
                if (_flag) {
                    _x = -canvas.width / 2 - textWidth / 2
                } else {
                    _x = -canvas.width / 2
                }
                _flag = !_flag
            }
        }
        context.translate(canvas.width / 2, canvas.height / 2)
        context.rotate(30 * Math.PI / 180)
        context.translate(-canvas.width / 2, -canvas.height / 2)
    }

    if (points.length <= 0) {
        points = [{
            _x, _y
        }]
    }
    context.globalAlpha = 0.3
    for (let i = 0; i < points.length; i++) {
        let _point = points[i]
        context.strokeStyle = '#fff'
        context.strokeText(text, _point._x, _point._y, textWidth)
        context.fillStyle = '#333'
        context.fillText(text, _point._x, _point._y, textWidth)
    }
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.globalAlpha = 1
    Els.elFinalImage.setAttribute('src', getDataURL(canvas))
}

/**
 * 图片水印上传
 * @param {object} options
 * @param {File} options.file
 */
export function watermarkImgUpload(options) {
    const file = options.file
    if (!isImage(file)) {
        throw new Error('invalid image')
    }
    const fileReader = new FileReader()
    fileReader.onload = () => {
        const imageUrl = fileReader.result
        const image = new Image()
        image.src = imageUrl
        image.onload = () => {
            const _canvas = document.createElement('canvas')
            _canvas.width = image.width
            _canvas.height = image.height
            const _ctx = _canvas.getContext('2d')
            _ctx.globalAlpha = 0.3
            _ctx.drawImage(image, 0, 0, image.width, image.height)
            const _watermark = _canvas.toDataURL()
            const _image = new Image()
            _image.src = _watermark
            _image.onload = () => {
                watermarkSource = _image
                watermarkSourceWidth = _image.width
                watermarkSourceHeight = _image.height
                watermarkImgUpdate()
            }
        }
    }
    fileReader.readAsDataURL(file)
}

/**
 * 图片水印更新
 */
export function watermarkImgUpdate() {
    if (!watermarkSource) {
        return
    }
    const { canvas, context } = getState()
    const position = Els.elWatermarkImgPosition.value
    const size = Els.elWatermarkImgSize.value
    const scale = size / 100
    watermarkSource.width = watermarkSourceWidth * scale
    watermarkSource.height = watermarkSourceHeight * scale
    let _x = 10, _y = 10
    if (position == 1) {
        _x = canvas.width - 10 - watermarkSource.width
    }
    if (position == 2) {
        _y = canvas.height - 10 - watermarkSource.height
    }
    if (position == 3) {
        _x = canvas.width - 10 - watermarkSource.width
        _y = canvas.height - 10 - watermarkSource.height
    }
    if (position == 4) {
        _x = canvas.width / 2 - watermarkSource.width / 2
        _y = canvas.height / 2 - watermarkSource.height / 2
    }
    drawSourceImage()
    context.drawImage(watermarkSource, _x, _y, watermarkSource.width, watermarkSource.height)
    Els.elFinalImage.setAttribute('src', getDataURL(canvas))
}
