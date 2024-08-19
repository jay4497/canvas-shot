/**
 * module format convert
 */

import { download } from "./common.js"
import { drawSourceImage } from "./common.js"
import { elFinalImage } from "./elements.js"
import { getState } from "./state.js"

export function convertTo(format) {
    const canvas = getState('canvas')
    drawSourceImage()
    let imageSrc = ''
    if (format === 'png') {
        imageSrc = canvas.toDataURL('image/png')
    }
    if (format === 'jpg') {
        imageSrc = canvas.toDataURL('image/jpeg')
    }
    if (imageSrc) {
        elFinalImage.setAttribute('src', imageSrc)
        download()
    }
}
