const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const pen = document.getElementById('instruments__pen');
const eyedropper = document.getElementById('instruments__eyedropper');
const bucket = document.getElementById('instruments__fillbucket');
const colorInput = document.getElementById('choose-color');
const colors = document.querySelectorAll('.click-color');
const changeCanvasSize = document.querySelector('#canvas-size');
const currentCanvasSize = document.querySelector('#canvas-size-value');
let selectedInstrument = '';
const myColor = {
    current : '#00ff00',
    prev:'#FFA500',
    set:  (color) => {
        myColor.prev = myColor.current;
        myColor.current = color;
    },
    timeColor: '#FFA500',
};
let selected;
document.onkeydown  = document.onkeypress  = keyboardHandle;
pen.addEventListener('click', () => penClick());
eyedropper.addEventListener('click', () => eyedropperClick());
bucket.addEventListener('click', () => bucketClick());
changeCanvasSize.oninput = setCanvasSize;
colorInput.onchange = function(){
    myColor.timeColor = myColor.prev;
    myColor.set(this.value) ;
    colorInput.style.background = this.value;
    visualPrevAndCurrentColors();
};
colors.forEach(function(element) {
    element.addEventListener('click', () => {
        if (element.id === 'prev' ) {
            myColor.set(myColor.timeColor);
            myColor.timeColor = myColor.prev;
        } else {
            myColor.set(element.getAttribute('value'));
            myColor.timeColor = myColor.prev;
        }
        visualPrevAndCurrentColors();
    })
});
document.querySelector('.instruments').addEventListener('click', (event)=> {
    let target = event.target;
    if ( target.className === 'instruments-button') {
        selectedBtn(target)
    }
});

function selectedBtn(btn) {
    if (selected) {
        selected.classList.remove('button-click');
    }
    selected = btn;
    selected.classList.add('button-click');
}
function changeCursor(instrument) {
    document.querySelector('#canvas').classList.remove('cursor-pen', 'cursor-eyedropper', 'cursor-bucket');
    if (instrument === 'pen') {document.querySelector('#canvas').classList.add('cursor-pen')}
    if (instrument === 'eyedropper') {document.querySelector('#canvas').classList.add('cursor-eyedropper')}
    if (instrument === 'bucket') {document.querySelector('#canvas').classList.add('cursor-bucket')}
}
function visualPrevAndCurrentColors() {
    document.querySelector('#current').style.background = `${myColor.current}`;
    document.querySelector('#current').setAttribute('value', `${myColor.current}`);
    document.querySelector('#prev').style.background = `${myColor.prev}`;
    document.querySelector('#prev').setAttribute('value', `${myColor.prev}`);
}
function resetCanvasEvents() {
    canvas.onmousedown = null;
    canvas.onmousemove = null;
    canvas.onmouseup = null;
}
function penClick() {
    selectedInstrument = 'instruments__pen';
    let sizeParametr = 512/canvas.width;
    context.lineWidth = 0;
    resetCanvasEvents();
    changeCursor('pen');
    let drawing = false;
    let mousePos = {
        x: 0,
        y: 0
    };
    let lastPos = mousePos;

    canvas.onmousedown = function(e) {
        drawing = true;
        context.strokeStyle = myColor.current;
        context.beginPath();
        lastPos = getMousePos(canvas, e);
    };

    canvas.onmouseup = function(e) {
        drawing = false;
        context.closePath();
    };

    canvas.onmousemove = function(e) {
        mousePos = getMousePos(canvas, e);
        renderCanvas();
    };
    function getMousePos(canvasDom, mouseEvent) {
        let rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        }
    }
    function renderCanvas() {
        if (drawing) {
            context.moveTo(lastPos.x/sizeParametr, lastPos.y/sizeParametr);
            context.lineTo(mousePos.x/sizeParametr, mousePos.y/sizeParametr);
            context.stroke();
            lastPos = mousePos;
        }
    }
}
function eyedropperClick (){
    selectedInstrument = 'instruments__eyedropper';
    let sizeParametr = 512/canvas.width;
    resetCanvasEvents();
    changeCursor('eyedropper');
    canvas.onmousedown = function  (event) {
        let position = findPos(this);
        let x = event.pageX - position.x;
        let y = event.pageY - position.y;
        let p = context.getImageData(x/sizeParametr, (y+20)/sizeParametr, 1, 1).data;
        let hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        myColor.set(hex);
        myColor.timeColor = myColor.prev;
        visualPrevAndCurrentColors();
    }

}
function bucketClick () {
    selectedInstrument = 'instruments__fillbucket';
    resetCanvasEvents();
    changeCursor('bucket');
    canvas.onmouseup = function(event) {
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = myColor.current;
        context.fill();
        context.beginPath();
    }
}
function findPos(obj){
    let current_left = 0, current_top = 0;
    if (obj.offsetParent){
        do{
            current_left += obj.offsetLeft;
            current_top += obj.offsetTop;
        }while(obj = obj.offsetParent);
        return {x: current_left, y: current_top};
    }
    return undefined;
}
function rgbToHex(r, g, b){
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
function keyboardHandle(e) {
    let keyFromBoard = e.key;
    if (keyFromBoard === 'b') {
        bucketClick();
        selectedBtn(document.getElementById('instruments__fillbucket'))
    }
    if (keyFromBoard === 'p') {
        penClick();
        selectedBtn(document.getElementById('instruments__pen'))
    }
    if (keyFromBoard === 'c') {
        eyedropperClick();
        selectedBtn(document.getElementById('instruments__eyedropper'))
    }
    return;
}
function setCanvasSize() {
    saveDrawing();
    setCanvasSizeAfterReload(this.value);
    localStorage.setItem('canvasSize', canvas.width);
    getDrawing();
    setInstrument(localStorage.getItem('instrument'));
    visualPrevAndCurrentColors();
}

function saveDrawing() {
    localStorage.setItem('canvas', canvas.toDataURL());
    localStorage.setItem('currColor',myColor.current);
    localStorage.setItem('prevColor',myColor.prev);
    localStorage.setItem('canvasSize', canvas.width);
    localStorage.setItem('instrument', selectedInstrument);
}
function getDrawing() {
    const dataURL = localStorage.getItem('canvas');
    if (dataURL) {
        const img = new Image;
        img.crossOrigin = 'Anonymous';
        img.src = dataURL;
        img.onload = function () {
            if ( img.width <= canvas.width || img.height <= canvas.height) {
                context.drawImage(img, (canvas.width-img.width)/2, (canvas.height-img.height)/2);
            } else {
                img.width = canvas.width;
                img.height = canvas.height;
                context.drawImage(img, canvas.width/16-canvas.width/4, canvas.height/16-canvas.height/4);
            }
        };
    }
}
function setInstrument(inst) {
    if (inst ==='instruments__pen') { penClick()}
    if (inst ==='instruments__eyedropper') { eyedropperClick()}
    if (inst ==='instruments__fillbucket') { bucketClick()}
    selectedBtn(document.getElementById(`${inst}`));
}
function setCanvasSizeAfterReload(size) {
    changeCanvasSize.value=size;
    currentCanvasSize.innerHTML = `${size}x${size}`;
    canvas.width = size;
    canvas.height = size;
}
window.onload = function unit () {
    if (!localStorage.getItem('currColor')) {
        myColor.current = '#00ff00';
        myColor.prev = '#FFA500';
        setCanvasSizeAfterReload('512');
        setInstrument('instruments__pen');
    } else {
        myColor.current = (localStorage.getItem('currColor'));
        myColor.prev = (localStorage.getItem('prevColor'));
        setCanvasSizeAfterReload(localStorage.getItem('canvasSize'));
        getDrawing();
        setInstrument(localStorage.getItem('instrument'));
        myColor.timeColor = myColor.prev;
    }
    visualPrevAndCurrentColors();
};
window.onbeforeunload = function() {
    saveDrawing();
};




