/**
 * module rotate
 */

import { elRotateStep, elFinalImage } from "./elements.js"
import { getState } from "./state.js"
import { drawSourceImage, getDataURL } from "./common.js"

let radius = 0

export function rotateUpdate() {
    const { canvas, context, sourceImage } = getState()
    const step = elRotateStep.value || 30
    const direction = this.dataset.type
    if (direction === 'left') {
        radius -= parseInt(step)
    } else {
        radius += parseInt(step)
    }

    const angle = radius * Math.PI / 180
    const rotatedWidth = sourceImage.height * Math.abs(Math.sin(angle)) + sourceImage.width * Math.abs(Math.cos(angle))
    const rotatedHeight = sourceImage.height * Math.abs(Math.cos(angle)) + sourceImage.width * Math.abs(Math.sin(angle))
    canvas.width = rotatedWidth
    canvas.height = rotatedHeight
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(angle)
    context.translate(-canvas.width / 2, -canvas.height / 2)
    context.drawImage(sourceImage, (canvas.width - sourceImage.width) / 2, (canvas.height - sourceImage.height) / 2, sourceImage.width, sourceImage.height)
    context.setTransform(1, 0, 0, 1, 0, 0)
    elFinalImage.setAttribute('src', getDataURL(canvas))
}

export function reverse() {
    const { canvas, context, sourceImage } = getState()
    const type = this.dataset.type
    let scaleX = 1, scaleY = 1,
        transX = 0, transY = 0
    if (type === 'x') {
        scaleX = -1
        transX = -canvas.width
    }
    if (type === 'y') {
        scaleY = -1
        transY = -canvas.height
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.scale(scaleX, scaleY)
    context.translate(transX, transY)
    context.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height)
    elFinalImage.setAttribute('src', getDataURL(canvas))
}

export function rotateReset() {
    radius = 0
    const { canvas, context, sourceImage } = getState()
    canvas.width = sourceImage.width
    canvas.height = sourceImage.height
    drawSourceImage()
    elFinalImage.setAttribute('src', getDataURL(canvas))
}
