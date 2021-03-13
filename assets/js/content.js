const images = [
    {src: '../images/icons8-delete.svg', width: 200, height: 200},
    {src: '../images/icons8-facebook.svg', width: 200, height: 200},
    {src: '../images/icons8-home.svg', width: 200, height: 200},
    {src: '../images/icons8-instagram.svg', width: 200, height: 200},
    {src: '../images/icons8-marker.svg', width: 200, height: 200},
    {src: '../images/icons8-phone.svg', width: 200, height: 200},
    {src: '../images/icons8-search.svg', width: 200, height: 200},
    {src: '../images/icons8-settings.svg', width: 200, height: 200}
  ]
  
  function getImage(img) {
      console.log(img.src);
    return `<div class="draggable-item image-box">
                          <img src="${img.src}" data-image-url="${img.src}">
              </div>`
  }
  
  function addShapes(container) {
    container.innerHTML += `<div class="shape draggable-item green" data-color="0ca788">I am shape</div><div class="shape draggable-item red" data-color="f24726">Me too</div>`
  }
  
  function addImages(container) {
    container.innerHTML += images.map((i) => getImage(i)).join('')
  }
  
  function createImage(canvasX, canvasY, url) {
    return miro.board.widgets.create({
      type: 'image',
      url: url,
      x: canvasX,
      y: canvasY,
    })
  }
  
  function createShape(canvasX, canvasY, color, text) {
    return miro.board.widgets.create({
      type: 'shape',
      text: text,
      x: canvasX,
      y: canvasY,
      style: {
        textColor: '#fff',
        backgroundColor: '#' + color,
        borderColor: 'transparent',
      },
    })
  }
  
  function bootstrap() {
    const container = document.getElementById('container')
    addShapes(container)
    addImages(container)
  
    let currentImageUrl
    const imageOptions = {
      draggableItemSelector: 'img',
      onClick: async (targetElement) => {
        const url = targetElement.getAttribute('data-image-url')
        const widget = (await createImage(0, 0, url))[0]
        miro.board.viewport.zoomToObject(widget)
      },
      getDraggableItemPreview: (targetElement) => {
        //drag-started
        currentImageUrl = targetElement.getAttribute('data-image-url')
        return {
          width: 100,
          height: 100,
          url: currentImageUrl,
        }
      },
      onDrop: (canvasX, canvasY) => {
        console.log('onDrop 1')
        createImage(canvasX, canvasY, currentImageUrl)
      },
    }
    miro.board.ui.initDraggableItemsContainer(container, imageOptions)
  
    let currentShapeColor
    let currentShapeText
    const shapeOptions = {
      draggableItemSelector: '.shape',
      onClick: async (targetElement) => {
        const color = targetElement.getAttribute('data-color')
        const text = targetElement.innerText
        const widget = (await createShape(0, 0, color, text))[0]
        miro.board.viewport.zoomToObject(widget)
      },
      getDraggableItemPreview: (targetElement) => {
        currentShapeColor = targetElement.getAttribute('data-color')
        currentShapeText = targetElement.innerText
        return {
          url: `data:image/svg+xml,%3Csvg width='140' height='140' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Crect stroke='null' x='0' y='0' fill='%23${currentShapeColor}' height='140' width='140'/%3E%3C/g%3E%3C/svg%3E`,
        }
      },
      onDrop: (canvasX, canvasY) => {
        console.log('onDrop 2')
        createShape(canvasX, canvasY, currentShapeColor, currentShapeText)
      },
    }
    miro.board.ui.initDraggableItemsContainer(container, shapeOptions)
  }
  
  miro.onReady(bootstrap)