// const fs = require('fs-extra');
// const path = require('path');
// const request = require("request");
const clip = require("electron").clipboard;
// const nativeImage = require('electron').nativeImage
// const clipboardListener = require("clipboard-event");

var path = require('path');
var fs = require('fs');
// const fs = require('fs-extra');

let tabListCache = []

var dir = "/Users/yutianran/Documents/Test/"

window.exports = {
    'hello': {
        mode: 'list',
        args: {
            enter: (action, callbackSetList) => {
                console.log("##1")
                getClipboardData(callbackSetList);
            },
            search: (action, searchWord, callbackSetList) => {
                console.log("##2")
                const folder = path.resolve(__dirname);
                console.log("folder="+folder)
                getClipboardData(callbackSetList);
                // var clipboardData = clip.readText()
                // console.log("##2-" + clipboardData)
                // if (!searchWord) return callbackSetList(tabListCache)
                // console.log(searchWord)
                // var urlEncode = encodeURIComponent(searchWord)
                // var urlDecode = decodeURIComponent(urlEncode)
                // tabListCache = []
                // tabListCache.push({
                //     title: "clipboardData",
                //     description: clipboardData
                // })
                // tabListCache.push({
                //     title: searchWord,
                //     description: "![](https://filedn.com/lCwzHP6EMjTBdpWjo6o7aHy/" + urlEncode + ")"
                // })
                // callbackSetList(tabListCache)
            },
            select: (action, itemData) => {
                console.log("##3")
                // console.log(itemData.description)
            }
        }
    },
}

function getClipboardData(callbackSetList) {
    tabListCache = []
    // 文本类型
    if (clip.readText() !== "") {
        var clipboardData = clip.readText();
        console.log("文本类型：" + clipboardData);
        var urlEncode = encodeURIComponent(clipboardData);
        var mdlink = `![](https://filedn.com/lCwzHP6EMjTBdpWjo6o7aHy/${urlEncode}`;
        window.utools.copyText(mdlink);
        tabListCache.push({
            title: clipboardData,
            description: mdlink
        });
    }

    // 图片类型
    else if (!clip.readImage().isEmpty()) {
        var clipboardData = clip.readImage();
        console.log("图片类型：" + clipboardData.constructor);
        const buffer = clipboardData.toPNG();
        console.log("buffer:" + buffer.constructor);
        var imgData = new Buffer(clipboardData.toPNG(), 'base64'); //Buffer编码
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        var imgPath = dir + fileName + ".png"
        console.log("imgPath:" + imgPath);
        fs.writeFile(imgPath, imgData, function (err) {
            if (err) {
                console.log("图片上传失败")
                console.log(err);
            } else {
                console.log("图片保存成功：" + imgPath);
                // window.utools.hideMainWindow()
            }
        });
    }

    // 文件类型
    else {
        console.log("文件类型：" + clipboardData);
        var copyedFiles = window.utools.getCopyedFiles();
        console.log(copyedFiles[0]);
        tabListCache.push({
            title: "文件类型：",
            description: copyedFiles[0].name
        });
        // TODO 对于md文件，可以先用pandoc在pcloud文件夹下面生成对应的html文件，就相当于发布博客了
        // TODO 对于图片，可以先压缩一下，然后复制到pcloud文件夹，就相当于图床了
    }
    callbackSetList(tabListCache);
}

// 保存剪切版里面的图片到本地文件夹
// async function saveClipboardImage(clipboardData) {
//    
//     // fs.writeFile(path.resolve(imgPath), imgData, function (err) {
//     //     if (err) {
//     //         console.log("保存失败：" + imgPath);
//     //         console.log(err);
//     //     } else {
//     //         console.log("保存成功：" + imgPath);
//     //     }
//     // });
//     // const folder = path.resolve(__dirname, '../tmp/');
//     // const filePath = `${folder}/${fileName}.png`;
//     await fs.writeFile(imgPath, imgData);
//     return filePath;
// }