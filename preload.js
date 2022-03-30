// const fs = require('fs-extra');
// const path = require('path');
// const request = require("request");
const clip = require("electron").clipboard;
// const nativeImage = require('electron').nativeImage
// const clipboardListener = require("clipboard-event");

const path = require('path');
const fs = require('fs');

// const fs = require('fs-extra');

// let tabListCache = []

const mdHost = "https://filedn.com/lCwzHP6EMjTBdpWjo6o7aHy/"
// const dir = "/Users/yutianran/Documents/Test/"
const home = window.utools.getPath("home")
const dir=path.join(home, '/Dropbox/MyBillfish/Public Folder');
let folder = path.resolve(__dirname);

window.exports = {
    'hello': {
        mode: 'none',
        args: {
            enter: (action) => {
                console.log("##1")
                console.log("folder=" + folder)
                console.log("home=" + home)
                console.log("dir=" + dir)
                const clipboardData = getClipboardData();
                const mdlink = withUrlEncode(clipboardData);
                window.utools.copyText(mdlink);
                // window.utools.outPlugin()
                // window.utools.hideMainWindow()
            },
            // search: (action, searchWord, callbackSetList) => {
            //     console.log("##2")
            //     getClipboardData(callbackSetList);
            //     // var clipboardData = clip.readText()
            //     // console.log("##2-" + clipboardData)
            //     // if (!searchWord) return callbackSetLis1t(tabListCache)
            //     // console.log(searchWord)1 
            //     // var urlEncode = encodeURIComponent(searchWord)
            //     // var urlDecode = decodeURIComponent(urlEncode)
            //     // tabListCache = []
            //     // tabListCache.push({
            //     //     title: "clipboardData",
            //     //     description: clipboardData
            //     // })
            //     // tabListCache.push({
            //     //     title: searchWord,
            //     //     description: "![](https://filedn.com/lCwzHP6EMjTBdpWjo6o7aHy/" + urlEncode + ")"
            //     // })
            //     // callbackSetList(tabListCache)
            // },
            // select: (action, itemData) => {
            //     console.log("##3")
            //     // console.log(itemData.description)
            // }
        }
    },
}

function getClipboardData() {
    // tabListCache = []
    // 文本类型
    if (clip.readText() !== "") {
        var clipboardData = clip.readText();
        console.log("文本类型：" + clipboardData);
        // tabListCache.push({
        //     title: clipboardData,
        //     description: mdlink
        // });
        return clipboardData
    }

    // 图片类型
    else if (!clip.readImage().isEmpty()) {
        var clipboardData = clip.readImage();
        // console.log("图片类型：" + clipboardData.constructor);
        const buffer = clipboardData.toPNG();
        // console.log("buffer:" + buffer.constructor);
        var imgData = new Buffer(clipboardData.toPNG(), 'base64'); //Buffer编码
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        var imgPath = dir + fileName + ".png"
        // console.log("imgPath:" + imgPath);
        fs.writeFile(imgPath, imgData, function (err) {
            if (err) {
                console.log("图片上传失败:" + imgPath)
                console.log(err);
                return ""
            } else {
                console.log("图片保存成功:" + imgPath);
                // window.utools.hideMainWindow()


                return imgPath
            }
            // tabListCache.push({
            //     title: copyedFiles[0].name,
            //     description: imgPath
            // });
        });
    }

    // 文件类型
    else {
        console.log("文件类型：" + clipboardData);
        var copyedFiles = window.utools.getCopyedFiles();
        console.log(copyedFiles[0]);
        // tabListCache.push({
        //     title: "文件类型：",
        //     description: copyedFiles[0].name
        // });
        imgName = copyedFiles[0].name
        imgPath = copyedFiles[0].path
        console.log("imgPath=" + imgPath)
        destPath=path.join(dir,imgName)
        console.log("destPath="+destPath)
        // fs.rename(imgPath, destPath, function (err) {
        //     if (err) throw err;
        //     fs.stat(destPath, function (err, stats) {
        //         if (err) throw err;
        //         console.log('stats: ' + JSON.stringify(stats));
        //     });
        // });
        return imgPath
        // TODO 对于md文件，可以先用pandoc在pcloud文件夹下面生成对应的html文件，就相当于发布博客了
        // TODO 对于图片，可以先压缩一下，然后复制到pcloud文件夹，就相当于图床了
    }
    // callbackSetList(tabListCache);
}


function withUrlEncode(src) {
    var urlEncode = encodeURIComponent(src);
    var mdlink = `![](${mdHost}${urlEncode})`;
    return mdlink;
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