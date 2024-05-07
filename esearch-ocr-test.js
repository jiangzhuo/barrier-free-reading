const x = require("esearch-ocr");
// const fs = require("fs");

start();

async function start() {
    await x.init({
        detPath: "/home/jiangzhuo/Downloads/ocr-model/ch_v3/ppocr_det.onnx",
        recPath: "/home/jiangzhuo/Downloads/ocr-model/en/en_PP-OCRv3_rec_infer.onnx",
        // dic: fs.readFileSync("/home/jiangzhuo/Downloads/ocr-model/en/en_dict.txt").toString(),
        dic: "0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~!\"#$%&'()*+,-./ \n",
        dev: true,
        node: true,
    });
    let img = document.createElement("img");
    img.src = "../a.png";
    img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        x.ocr(canvas.getContext("2d").getImageData(0, 0, img.width, img.height)).then((v) => {
            let tl = [];
            for (let i of v) {
                tl.push(i.text);
            }
            let p = document.createElement("p");
            p.innerText = tl.join("\n");
            document.body.append(p);
        });
    };
}