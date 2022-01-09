//获取照片类型、URL和名称
function getString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]); //解决中文乱码问题
    }
}

var type = getString("type");
var url = getString("url");
var name = getString("name");
var fully_url = "img/" + type + "/" + url;
document.getElementById("name").innerText = name;
document.getElementById("photo").src = fully_url;
document.getElementById("origin").src = fully_url;
document.getElementById("crop-img").src = fully_url;

//rotate
let rotate = document.getElementById("rotate");
rotate.addEventListener("click", function () {
    let img = document.getElementById("photo");
    let list = img.classList;
    console.log(list);
    if (list.contains("rotated")) {
        list.remove("rotated");
        list.add("rotate");
    } else {
        list.remove("rotate");
        list.add("rotated");
    }
});

//range
function range(block, str) {
    let old = block.getElementsByTagName("span")[0];
    let input = block.getElementsByTagName("input")[0];
    old.innerHTML = input.value;
    let value = input.value;
    let img = document.getElementById("photo");
    let styles = img.style.filter.split(" ");
    styles = styles.filter((cur) => !cur.startsWith(str));
    styles.push(str + "(" + value + ")");
    console.log(styles);
    img.style.filter = styles.join(" ");
}

let filters = ["brightness", "opacity", "saturate", "invert", "contrast", "grayscale", "sepia"];

filters.forEach((cur) => {
    let block = document.getElementById(cur);
    block.getElementsByTagName("input")[0].addEventListener("change", () => range(block, cur));
});

//style
let style = ["vintage", "lomo", "clarity", "sunrise", "love"];

style.forEach((cur) => {
    let btn = document.getElementById(cur);
    btn.addEventListener("click", () => {
        Caman("#canvas", fully_url, function () {
            if (cur.startsWith("vintage")) {
                this.vintage();
            }
            if (cur.startsWith("lomo")) {
                this.lomo();
            }
            if (cur.startsWith("clarity")) {
                this.clarity();
            }
            if (cur.startsWith("sunrise")) {
                this.sunrise();
            }
            if (cur.startsWith("love")) {
                this.love();
            }
            this.render();
        });
    });
});

//crop
function getRoundedCanvas(sourceCanvas) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = "destination-in";
    context.beginPath();

    context.fill();
    return canvas;
}

window.addEventListener("DOMContentLoaded", function () {
    var image = document.getElementById("crop-img");
    var button = document.getElementById("crop-btn");
    var result = document.getElementById("crop-res");
    var croppable = false;
    var cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        ready: function () {
            croppable = true;
        },
    });

    button.onclick = function () {
        var croppedCanvas;
        var roundedCanvas;
        var roundedImage;

        if (!croppable) {
            return;
        }
        // Crop
        croppedCanvas = cropper.getCroppedCanvas();
        // Round
        roundedCanvas = getRoundedCanvas(croppedCanvas);
        // Show
        roundedImage = document.createElement("img");
        roundedImage.src = roundedCanvas.toDataURL();
        result.innerHTML = "";
        result.appendChild(roundedImage);
    };
});
