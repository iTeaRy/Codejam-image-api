let url = `https://api.unsplash.com/photos/random?query=town,Minsk&client_id=529e8b2a5dae3d703a5a4663abb96928e543a02eda61798dcdfc254f874b9417`;
const  loadImageButton = document.querySelector('#load-image');
const  loadImageInput = document.querySelector('#load-image-input');
const  imageToBWButton = document.querySelector('#black-and-white');
const imageSize = {
    width: 0,
    height: 0,
    sx: 0,
    sy: 0,
};
imageToBWButton.onclick = setImageToBWButton;
loadImageButton.onclick = getLinkToImage;
loadImageInput.onchange = changeTown;
function changeTown() {
    let town = loadImageInput.value;
    url = `https://api.unsplash.com/photos/random?query=town,${town}&client_id=529e8b2a5dae3d703a5a4663abb96928e543a02eda61798dcdfc254f874b9417`;
}
function setAnimation (data) {
    data.classList.add('animation');
    setTimeout(() => data.classList.remove('animation'),1000);
}
async function getLinkToImage() {
    setAnimation(loadImageButton);
    let imageURL;
    try {
        const response = await fetch(url);
        const data = await response.json();
        imageURL = data.urls.small;
        drawImageFromApi(imageURL);
        } catch (e) {
        alert(`${e}`);
    }

}

function drawImageFromApi(imgURL) {
    const img = new Image;
    img.crossOrigin = 'Anonymous';
    img.src = imgURL;

    img.onload = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if ( img.width < canvas.width || img.height < canvas.height) {
            context.drawImage(img, (canvas.width-img.width)/2, (canvas.height-img.height)/2);
            imageSize.sx = (canvas.width-img.width)/2;
            imageSize.sy = (canvas.height-img.height)/2;
        } else {
            img.width = canvas.width;
            context.drawImage(img, 0, 0);
            imageSize.sx = 0;
            imageSize.sy = 0;
        }
        imageSize.height = img.height;
        imageSize.width = img.width;

    };
}

function setImageToBWButton() {
    try{
        let imgData = context.getImageData(imageSize.sx, imageSize.sy, imageSize.width, imageSize.height);
        let pixels = imgData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2])/3);
            pixels[i] = lightness;
            pixels[i + 1] = lightness;
            pixels[i + 2] = lightness;
        }
        context.putImageData(imgData, imageSize.sx, imageSize.sy);
    } catch (e) {
        alert('image is not loaded');
    }

}


