/**
 * index js
 */

const canvas = document.getElementById('work-canvas')
const context = canvas.getContext('2d')
let sourceImage = null

const elFinalImage = document.getElementById('work-image')
const initArea = document.getElementById('init-area')
const elUploadBtn = document.getElementById('upload-btn')
const elFileInput = document.getElementById('file-input')
const elWorkArea = document.getElementById('work-area')
const elResetBtn = document.getElementById('reset')
const elWatermarkBtn = document.getElementById('watermark-btn')
const elWatermarkImgBtn = document.getElementById('watermark-img-btn')
const elWatermarkText = document.getElementById('watermark-text')
const elWatermarkPosition = document.getElementById('watermark-position')
const elWatermarkFontSize = document.getElementById('watermark-font-size')

elFileInput.addEventListener('change', upload)
elUploadBtn.addEventListener('click', () => {
    elFileInput.click()
})
elResetBtn.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    elFinalImage.setAttribute('src', '')
    sourceImage = null
    initArea.style.display = 'flex'
    elWorkArea.style.display = 'none'
})

for (let i = 16; i < 100; i++) {
    if (i % 2 === 0) {
        const optionEl = document.createElement('option')
        optionEl.value = i
        optionEl.innerText = i + 'px'
        optionEl.style.fontSize = i + 'px'
        elWatermarkFontSize.appendChild(optionEl)
    }
}
elWatermarkBtn.addEventListener('click', () => {
    toggleMenu('.watermark-menu')
})
elWatermarkText.addEventListener('change', watermarkUpdate)
elWatermarkPosition.addEventListener('change', watermarkUpdate)
elWatermarkFontSize.addEventListener('change', watermarkUpdate)

function upload(e) {
    const files = e.target.files
    if (files.length === 0) {
        return
    }
    initArea.style.display = 'none'
    elWorkArea.style.display = 'flex'
    const file = files[0]
    const fileUrl = URL.createObjectURL(file)
    const img = new Image()
    img.src = fileUrl
    img.onload = () => {
        URL.revokeObjectURL(fileUrl)

        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0, img.width, img.height)
        sourceImage = img
        elFinalImage.setAttribute('src', getDataURL())
    }
}

function watermarkUpdate() {
    const text = elWatermarkText.value.trim()
    const position = elWatermarkPosition.value
    const fontSize = elWatermarkFontSize.value || 16
    if (text.length === 0) {
        return
    }

    drawSourceImage()
    context.font = fontSize + 'px "Microsoft YaHei",sans-serif'
    const textWidth = context.measureText(text).width
    console.log(textWidth, fontSize)
    let _x = 10, _y = parseInt(fontSize) + 10
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

    context.strokeStyle = '#fff'
    context.strokeText(text, _x, _y, textWidth)
    context.fillStyle = '#333333cc'
    context.fillText(text, _x, _y, textWidth)
    elFinalImage.setAttribute('src', getDataURL())
}

function getDataURL() {
    return canvas.toDataURL('png', 0.7)
}

function drawSourceImage() {
    if (sourceImage) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height)
    }
}

function toggleMenu(currentSelector) {
    const menu = document.querySelector(currentSelector)
    document.querySelectorAll('.menu-item').forEach((el) => {
        if (menu === el) {
            return
        }
        el.style.display = 'none'
    })
    menu.style.display = menu.style.display === 'block'? 'none': 'block'
}
