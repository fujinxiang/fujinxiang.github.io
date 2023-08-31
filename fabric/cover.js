const coverList = [
  {
    title: "FFMPEG",
    width: 900,
    height: 500,
    bgColor: "#fff",
    imgs: [
      {
        src: "https://cdn.jsdelivr.net/gh/fujinxiang/statics/images/ffmpeg.png",
        options: {
          left: 50,
          top: 138,
          opacity: 1,
        },
      },
    ],
    texts: [
      {
        text: "FFMPEG",
        options: {
          width: 600,
          fontSize: 120,
          fontFamily: "Arail Black",
          fontWeight: "900",
          fill: "black",
          left: 280,
          top: 180,
        },
      },
      {
        text: "几何裁剪",
        options: {
          width: 600,
          fontSize: 90,
          fontFamily: "楷体",
          fontWeight: "900",
          fill: "orange",
          left: 400,
          top: 300,
          textAlign: "end",
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
    backgroundColor: selectedCover.bgColor,
  });

  canvas.on('object:moving', function(e) {
    const element = e.target;
    console.log(element.left, element.top);
    app.message= `${element.name} left:${element.left},top:${element.top}`;
  });

  // 添加预置图片
  selectedCover.imgs.forEach((imgConfig, index) => {
    const img = new Image();
    // 设定跨域支持，必须在设置 src 之前
    img.setAttribute("crossOrigin", "anonymous");
    img.src = imgConfig.src;
    imgConfig.options.name = `img${index}`;

    img.onload = function () {
      const fabricImg = new fabric.Image(img, imgConfig.options);
      fabricImgs.push(fabricImg);
      canvas.add(fabricImg);
    };
  });

  // 添加预置文本
  selectedCover.texts.forEach((textConfig, index) => {
    textConfig.options.name = `text${index}`;

    const fabricText = new fabric.Textbox(textConfig.text, textConfig.options);
    fabricTexts.push(fabricText);
    canvas.add(fabricText);
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
    app.message='复制成功!';
  });
}
