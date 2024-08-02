/**
 * module events
 */

import {
    watermarkImgUpdate,
    watermarkImgUpload,
    watermarkUpdate
} from './watermark.js'
import {
    scaleUpdate,
    scaleReset
} from "./scale.js"
import {
    getDataURL,
    upload,
    toggleMenu
} from "./common.js"
import * as Els from './elements.js'
import * as State from "./state.js"

// 初次加载状态
let loaded = false

export function initEvents() {
    const that = this
    Els.elFileInput.addEventListener('change', (e) => {
        const files = e.target.files
        if (files.length > 0) {
            upload({
                file: files[0],
                callback(image) {
                    const canvas = document.createElement('canvas')
                    const context = canvas.getContext('2d')
                    canvas.width = image.width
                    canvas.height = image.height
                    context.drawImage(image, 0, 0, image.width, image.height)

                    State.setState({
                        canvas,
                        context,
                        sourceImage: image
                    })
                    Els.elFinalImage.setAttribute('src', getDataURL(canvas))
                    if (!loaded) {
                        initWorkAreaEvents()
                    }
                }
            })
        }
    })
    Els.elUploadBtn.addEventListener('click', () => {
        Els.elFileInput.click()
    })
}

function initWorkAreaEvents() {
    loaded = true

    Els.elResetBtn.addEventListener('click', () => {
        const { canvas, context } = State.getState()
        context.clearRect(0, 0, canvas.width, canvas.height)
        Els.elFinalImage.setAttribute('src', '')
        Els.initArea.style.display = 'flex'
        Els.elWorkArea.style.display = 'none'
        document.querySelectorAll('.menu-item').forEach((el) => {
            el.style.display = 'none'
        })
    })

    for (let i = 16; i < 100; i++) {
        if (i % 2 === 0) {
            const optionEl = document.createElement('option')
            optionEl.value = i
            optionEl.innerText = i + 'px'
            optionEl.style.fontSize = i + 'px'
            Els.elWatermarkFontSize.appendChild(optionEl)
        }
    }
    Els.elWatermarkBtn.addEventListener('click', () => {
        toggleMenu('.watermark-menu')
    })
    Els.elWatermarkText.addEventListener('change', watermarkUpdate)
    Els.elWatermarkPosition.addEventListener('change', watermarkUpdate)
    Els.elWatermarkFontSize.addEventListener('change', watermarkUpdate)

    Els.elWatermarkImgBtn.addEventListener('click', () => {
        toggleMenu('.watermark-img-menu')
    })
    Els.elWatermarkImgInput.addEventListener('change', (e) => {
        const files = e.target.files
        if (files.length > 0) {
            watermarkImgUpload({
                file: files[0]
            })
        }
    })
    Els.elWatermarkImgUploadBtn.addEventListener('click', () => {
        Els.elWatermarkImgInput.click()
    })
    Els.elWatermarkImgPosition.addEventListener('change', watermarkImgUpdate)
    Els.elWatermarkImgSize.addEventListener('change', watermarkImgUpdate)

    Els.elScaleBtn.addEventListener('click', () => {
        const sourceImage = State.getState('sourceImage')
        toggleMenu('.scale-menu')
        Els.elScaleWidth.value = sourceImage.width
        Els.elScaleHeight.value = sourceImage.height
    })
    Els.elScaleResetBtn.addEventListener('click', scaleReset)
    Els.elScaleWidth.addEventListener('blur', scaleUpdate)
    Els.elScaleHeight.addEventListener('blur', scaleUpdate)
}

