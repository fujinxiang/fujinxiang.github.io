const coverList = [
  {
    title: "封面1",
    width: 1200,
    height: 800,
    bgColor: "#999",
    imgs: [
      {
        src: "https://store-g1.seewo.com/seewolive/images/easiteach/default-user.svg",
        options: {
          left: 50,
          top: 140,
          opacity: 0.5,
        },
      },
    ],
    texts: [
      {
        text: "Title Text",
        options: {
          width: 1200,
          fontSize: 100,
          fontFamily: "微软雅黑",
          fill: "white",
          backgroundColor: "transparent",
          left: 0,
          top: 160,
          textAlign: "center",
        },
      },
    ],
  },
  {
    title: "封面2",
    width: 900,
    height: 500,
    bgColor: "#399",
    imgs: [
      {
        src: "https://store-g1.seewo.com/seewolive/images/easiteach/default-user.svg",
        options: {
          left: 50,
          top: 140,
          opacity: 0.5,
        },
      },
    ],
    texts: [
      {
        text: "Title Text",
        options: {
          width: 1200,
          fontSize: 100,
          fontFamily: "微软雅黑",
          fill: "white",
          backgroundColor: "transparent",
          left: 0,
          top: 160,
          textAlign: "center",
        },
      },
    ],
  },
];

let canvas1;
let canvas;
let fabricImgs = [];
let fabricTexts = [];

function generateCanvas(index) {
  const selectedCover = coverList[index]; // 默认选择第一个封面配置
  const container = document.querySelector(".container");

  // 清空容器
  container.innerHTML = "";

  canvas1 = document.createElement("canvas");
  canvas1.id = "canvas1";
  canvas1.width = selectedCover.width;
  canvas1.height = selectedCover.height;

  // 将 Canvas 添加到容器
  container.appendChild(canvas1);

  // 创建 Canvas 元素
  canvas = new fabric.Canvas("canvas1", {
    width: selectedCover.width,
    height: selectedCover.height,
    backgroundColor: selectedCover.bgColor,
  });

  // 添加预置图片
  selectedCover.imgs.forEach((imgConfig) => {
    const img = new Image();
    // 设定跨域支持，必须在设置 src 之前
    img.setAttribute("crossOrigin", "anonymous");
    img.src = imgConfig.src;

    img.onload = function () {
      const fabricImg = new fabric.Image(img, imgConfig.options);
      fabricImgs.push(fabricImg);
      canvas.add(fabricImg);
    };
  });

  // 添加预置文本
  selectedCover.texts.forEach((textConfig) => {
    const fabricText = new fabric.Textbox(textConfig.text, textConfig.options);
    fabricTexts.push(fabricText);
    canvas.add(fabricText);
  });

  // 添加拖拽和缩放功能
  fabricImgs.concat(fabricTexts).forEach((obj) => {
    obj.hasControls = obj.hasBorders = true;
    obj.lockRotation = true;
    obj.lockScalingFlip = true;
    obj.lockUniScaling = true;
    obj.lockSkewingX = true;
    obj.lockSkewingY = true;
    obj.lockScalingX = true;
    obj.lockScalingY = true;
    obj.lockMovementX = false;
    obj.lockMovementY = false;
    obj.selectable = true;
    obj.evented = true;
    obj.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
    });
    obj.set({
      borderColor: "#000",
      cornerColor: "#000",
      cornerSize: 10,
      transparentCorners: false,
    });
    obj.on("selected", function () {
      obj.set({
        borderColor: "#00F",
        cornerColor: "#00F",
      });
    });
    obj.on("deselected", function () {
      obj.set({
        borderColor: "#000",
        cornerColor: "#000",
      });
    });
  });

  // 监听选择图片事件
  const selectImg = document.querySelector("#selectImg");

  selectImg.removeEventListener("change", selectImage);
  selectImg.addEventListener("change", selectImage);
}

function selectImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function () {
      const fabricImg = new fabric.Image(img);
      fabricImgs.push(fabricImg);
      canvas.add(fabricImg);
    };
  };
  reader.readAsDataURL(file);
}

function download(objUrl, name) {
  const a = document.createElement("a");
  a.href = objUrl;
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  const url = canvas.toDataURL("image/jpg");
  download(url, "Canvas.jpg");
}

function copy() {
  canvas1.toBlob(function (blob) {
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]);
    alert("Copied! Paste it on paint");
  });
}
