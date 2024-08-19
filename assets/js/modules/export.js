/**
 * module export image
 */

import { elFinalImage } from './elements.js'

export function download() {
    const data = elFinalImage.getAttribute('src')
    const downloadLink = document.createElement('a')
    downloadLink.download = Date.now()
    downloadLink.href = data
    const clickEvent = document.createEvent('MouseEvents')
    clickEvent.initMouseEvent('click', false, false)
    downloadLink.dispatchEvent(clickEvent)
}
