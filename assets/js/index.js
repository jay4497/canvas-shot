/**
 * index js
 */

const canvas = document.getElementById('work-canvas')
const context = canvas.getContext('2d')
let sourceImage = null
let watermarkSource = null
let watermarkSourceWidth;
let watermarkSourceHeight;

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
const elWatermarkImgUploadBtn = document.getElementById('watermark-img-upload')
const elWatermarkImgInput = document.getElementById('watermark-img')
const elWatermarkImgPosition = document.getElementById('watermark-img-position')
const elWatermarkImgSize = document.getElementById('watermark-img-size')

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

elWatermarkImgBtn.addEventListener('click', () => {
    toggleMenu('.watermark-img-menu')
})
elWatermarkImgInput.addEventListener('change', watermarkImgUpload)
elWatermarkImgUploadBtn.addEventListener('click', () => {
    elWatermarkImgInput.click()
})
elWatermarkImgPosition.addEventListener('change', watermarkImgUpdate)
elWatermarkImgSize.addEventListener('change', watermarkImgUpdate)

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
    elFinalImage.setAttribute('src', getDataURL())
}

function watermarkImgUpload(e) {
    const files = e.target.files
    if (files.length === 0) {
        return
    }
    const file = files[0]
    const imageUrl = URL.createObjectURL(file)
    const image = new Image()
    image.src = imageUrl
    image.onload = () => {
        URL.revokeObjectURL(imageUrl)

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

function watermarkImgUpdate() {
    if (!watermarkSource) {
        return
    }
    const position = elWatermarkImgPosition.value
    const size = elWatermarkImgSize.value
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
