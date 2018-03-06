var imgForm=document.getElementById("inputArea");

//获取画布
var theCanvas=document.getElementById("showCanvas");
var resultCanvas=document.getElementById("targetCanvas");
var canvaImg=theCanvas.getContext("2d");
var resultImg =resultCanvas.getContext("2d");

imgForm.addEventListener("change",function (e) {

    var W=theCanvas.width,
        H=theCanvas.height;
    var drawImgHeight=W,
        drawImgStartY=0;
    //清除画布
    canvaImg.clearRect(0,0,W,H);
    resultImg.clearRect(0,0,W,H);

    //构造表单数据 以便提交
    var myForm=new FormData();
    var imgData=this.files[0];
    myForm.append("image",imgData);

    //获取图片数据  用于展示
    var reader=new FileReader();
    reader.readAsDataURL(imgData);
    var img=new Image();

    reader.onload=function (ev) {
        img.src=ev.target.result;
    }
    img.onload=function (ev) {
        if(img.width/img.height!=1){
            drawImgHeight=img.height*W/img.width;
            drawImgStartY=(H-drawImgHeight)/2;
        }
        canvaImg.drawImage(img,0,drawImgStartY,W,drawImgHeight);
    }

    var flag=false;

    var startX=0;
    var startY=0;
    var cutData;
    var showCanvas=document.getElementById("showCanvas");

    //当鼠标被按下
    theCanvas.addEventListener("mousedown",function (e) {
        flag=true;
        startX=e.clientX-showCanvas.offsetLeft;
        startY=e.clientY-showCanvas.offsetTop;
        // console.log(startX+":"+startY);
    });
    //当鼠标在移动
    theCanvas.addEventListener("mousemove",function (e) {
       if(flag){

           var _showLeft=e.clientX-showCanvas.offsetLeft,
               _showTop=e.clientY-showCanvas.offsetTop;

           var _width=_showLeft - startX,
               _height=_showTop - startY;

           if(_width>0&&_height>0){
               canvaImg.clearRect(0,0,W,H);
               canvaImg.drawImage(img,0,drawImgStartY,W,drawImgHeight);

               canvaImg.fillStyle ='rgba(255,255,255,0.6)';//设定为半透明的白色
               canvaImg.fillRect(0,0,_showLeft, startY);//矩形A
               canvaImg.fillRect(_showLeft,0 , W-_showLeft,_showTop);//矩形B
               canvaImg.fillRect(startX, _showTop, W-startX, H-_showTop);//矩形C
               canvaImg.fillRect(0 ,startY, startX, H-startY);//矩形D

               cutData = canvaImg.getImageData(startX, startY, _width,_height);
               resultImg.clearRect(0,0,W,H);//清空预览区域
               resultImg.putImageData(cutData,0,0);//将图片信息赋给预览区域
           }
       }
    });
    //当鼠标抬起
    theCanvas.addEventListener("mouseup",function (e) {
        flag=false;
    })

})
