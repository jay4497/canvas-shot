/**
 * module scale
 */

import { getDataURL, setImage } from "./common.js"
import * as Els from './elements.js'
import { getState } from "./state.js"

/**
 * 更新图片尺寸
 */
export function scaleUpdate() {
    const { canvas, context, sourceImage } = getState()
    context.clearRect(0, 0, canvas.width, canvas.height)
    let scaleWidth = Els.elScaleWidth.value
    let scaleHeight = Els.elScaleHeight.value
    const isKeepRatio = Els.elScaleKeepRatio.checked
    const _sourceImage = new Image(sourceImage.width, sourceImage.height)
    _sourceImage.src = sourceImage.src
    _sourceImage.onload = () => {
        const sourceImageWidth = _sourceImage.width
        const sourceImageHeight = _sourceImage.height

        if (isKeepRatio) {
            if (scaleWidth != canvas.width) {
                scaleHeight = canvas.height * (scaleWidth / canvas.width)
            }
            if (scaleHeight != canvas.height) {
                scaleWidth = canvas.width * (scaleHeight / canvas.height)
            }
        }
        _sourceImage.width = scaleWidth
        _sourceImage.height = scaleHeight

        Els.elScaleWidth.value = scaleWidth
        Els.elScaleHeight.value = scaleHeight
        canvas.width = scaleWidth
        canvas.height = scaleHeight
        context.drawImage(_sourceImage, 0, 0, scaleWidth, scaleHeight)
        setImage(canvas, Els.elFinalImage)
    }
}

/**
 * 恢复图片原始尺寸
 */
export function scaleReset() {
    const { canvas, context, sourceImage } = getState()
    const imageWidth = sourceImage.width
    const imageHeight = sourceImage.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    canvas.width = imageWidth
    canvas.height = imageHeight
    Els.elScaleWidth.value = imageWidth
    Els.elScaleHeight.value = imageHeight
    context.drawImage(sourceImage, 0, 0, imageWidth, imageHeight)
    setImage(canvas, Els.elFinalImage)
}
