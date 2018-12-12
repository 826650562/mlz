function TrajPointer() {
    //属性
     _isplaying=false;
    var segment = {
        startTime: 123444,//开始时间戳
        endTime: 123500,//结束时间戳
        type: 1,//1移动、2停留、3离线
        height: 20,//以像素为单位

        isEnd: false,//当前段是否结束
    };
    

    var j$ = $;
    var segments = [segment];             //所有的段

    var offset = 3;//每段的缝隙3px
    var initPostion = [112, 18];//指针绝对定位参数[left, top]
    var curPointer = 0; // 当前指针位置
    var sumHeight = 0; // 总高度
    var EH = 0;
    
    var template =
        '<div class="slider-thumb" id="slider">'
        +' <div id="vals">'
        +'<div class="vals_img">'
        +'	<img src="" draggable="false" />'
        +'</div>'
        +'<div class="vals_span" id = "stamp" >'
        +'</div>'
        +'</div>'
        +'</div>';//指针html模板
    var selector = ".slider-thumb"; // 当前指针选择器
    var me = this;

   
    //方法
    /**
     * 设置段的参数
     * @Author   Julian
     * @DateTime 2017-11-25T16:40:07+0800
     * @param    segment对象数组，如
     * [
     *  {
			startTime: 123444,//开始时间戳
			endTime: 123444,//结束时间戳
			type: 1,//1移动、2停留、3离线
			height: 20,//以像素为单位
		}
     ]
     */
    this.setSegments = function (segmentArr) {
        segments = segmentArr;
    }

    /**
     * 在给定位置的情况下渲染初始位置的指针
     * @Author   Julian
     * @DateTime 2017-11-25T16:40:07+0800
     * @param    _offset:每段的缝隙
     * @param    pos:初始位置数组[left,top]

     */
    this.render = function (_offset, pos, height) {
        offset = _offset;
        initPostion = pos;
        sumHeight = height;

        // 在设置完初始位置后加入到body中
        j$(template).css({
            "position": "absolute",
            "top": initPostion[1] + "px",
            "left": initPostion[0] + "px",
        }).appendTo('body');
        EH =  getPagePt();

        me.jump(0, segments[0].startTime);
    }

    /**
     * 计算给定段的开始位置
     * @Author   Julian
     * @DateTime 2017-11-25T17:18:38+0800
     * @param    {[NUMBER]}                 ind [段索引]
     * @return   {[NUMBER]}                     [开始位置结果]
     */
    function getSegmentTop(ind) {
        var zero = initPostion[1];	// 计算基准点
        for (var i = 0; i < ind; i++) {
            zero = zero + segments[i].height + offset;
        }
        return zero;
    }

    /**
     * 计算给定时间点在段内的偏移
     * @Author   Julian
     * @DateTime 2017-11-25T17:20:16+0800
     * @param    {[NUMBER]}                 ind [段索引]
     * @param    {[NUMBER]}                 t [时间戳]
     * @return   {[NUMBER]}                 [偏移量]
     */
    function getSegmentOffset(ind, t) {
        var seg = segments[ind], st = seg.startTime, dt = seg.endTime;
        var result = (t - st) * seg.height / (dt - st);
        return result;
    }


    /**
     * 时间格式转换
     * @param time
     * @param format
     */
    function transFormAndFormat(time, format) {
        Date.prototype.format = function (format) {
            var date = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;

        }
        return new Date(time).format(format);
    }

    /**
     * 时间戳(1511609136846)转换成时分秒(19:25:36) hh:mm:ss
     *
     * @param time
     */
    function getSingleTime(time) {
        return transFormAndFormat(time, 'hh:mm:ss')
    }

    /**
     * 跳至指定段的指定时刻
     * @Author   Julian
     * @DateTime 2017-11-25T17:09:35+0800
     * @param    {[num]}                 index [指定段的索引]
     * @param    {[number]}                 t     [时间戳]
     * @return   {[]}                       [无]
     */
    this.jump = function (index, t, newTop) {
        // 修改指针内容，包括图标，时刻，背景色
        var type = segments[index].type;

        if (newTop) {
            if (index == 0 && (newTop - initPostion[1]) <= 1) {
                // 已到达最顶部
                t = segments[index].startTime;
            }

            if (index == segments.length - 1 && (sumHeight + initPostion[1] - newTop) <= 1) {
                // 已到达最底部
                t = segments[segments.length - 1].endTime;
            }
        } else {
            // 基于时间计算位置
            newTop = initPostion[1] + (t - segments[0].startTime) * sumHeight / (segments[segments.length - 1].endTime - segments[0].startTime);
        }

        j$(selector).css("top", newTop + "px");
        j$(selector + " .vals_span").html(getSingleTime(t)); // 修改时刻
        if (type == 1) {
            j$(selector + " img").attr({
                src: 'mx/lsgj/images/icon/walk.png'
            });
            j$(selector + " div:first").css({
                border: '1px solid #3acc35',
                background: '#f0feee'
            });
            j$(selector + " div:first").removeClass('offline stop').addClass("walk"); // 修改行走图标，更改class
            //j$(selector + " div:first").addClass("walk"); // 修改行走图标，更改class
        } else if (type == 2) {
            j$(selector + " img").attr('src', 'mx/lsgj/images/icon/stop-person.png');
            j$(selector + " div:first").css({
                border: '1px solid #ed9c02',
                background: '#fdf7ec'
            });
            j$(selector + " div:first").removeClass('walk offline').addClass("stop"); // 修改停留图标，更改class
        } else if (type == 3) {
            j$(selector + " img").attr('src', 'mx/lsgj/images/icon/offline.png');
            j$(selector + " div:first").css({
                border: '1px solid #d85222',
                background: '#fef3ef'
            });
            j$(selector + " div:first").removeClass('walk stop').addClass("offline"); // 修改离线图标，更改class
        }
    }

    /**
     * 获取滑块所在位置的时间戳
     * @param seg 目标段
     * @param px 相对于本段底部的偏移量
     * @returns {number}
     */
    this.getTime = function (seg, px) {
        var time = (seg.endTime - seg.startTime) / seg.height * px + seg.endTime;
        return time;
    }


    /**
     * 移动到給定像素,获得对应的时刻
     * @Author   Julian
     * @DateTime 2017-11-25T17:09:35+0800
     * @param    {[num]}                 px [移动的像素数量,向上移动则为负数，向下移动则为正数]
     */
    this.moveToPx = function (px) {
        var newTop = me.checkPointerToPx(px);
        curPointer = newTop - initPostion[1];
        var indAndInt = me.getPointSegmentOfPx(curPointer); // 获得当前指针所在段
        var segIndex = indAndInt[0]; // 当前指针所在段索引
        var interval = indAndInt[1]; // 当前指针在当前段内的偏移量，如-10，表示在当前段从底部到上面10个像素

        try {
            var segment = segments[segIndex];
            var ts = me.getTime(segment, interval);	// 获得当前指针对应的时间戳
            var points = segment.showPt;
            var ind = getPoint(points,ts);
            me.jump(segIndex, ts, newTop);	// 跳转到给定段的给定时间
            
            var type = segment.type;
            // 判断该时间戳
            triggerNext(type,ind == -1 ? {sjc:ts} : points[ind],type == 3 ? segment.offlineIndex : segment.location);
        } catch (e) {
            MXZH.errorLog(e);
        }
    }

    /**
     * 确认一段轨迹的开始点和结束点和计算当前点距起点的像素差
     */
    function catchPoint(px) {
        var result = getIndexByPx(px);
        var height = 0;
        var Px,beginPx,endPx;
        for (var i = 0; i < segments.length; i ++) {
            height += segments[i].height;
            if (i == result[1]) {
                //找到起点和终点在相对于播放轴的像素值
                if(i == 0) {
                    beginPx = 0;
                }else {
                    beginPx = height - segments[result[1]].height;
                }
                endPx = height;
                //轨迹距起点的像素差
                Px = curPointer - (height - segments[result[1]].height);
            }
        }
        return [result[0],Px,beginPx,endPx];
    }


    /**
     * 根据像素获取段的在当前轨迹上当前点的位置和索引值
     * @param px  像素值
     * @returns {Array}
     */
    function getIndexByPx(px) {
        var result = [];
        // 获取指针移动的位置
        var newTop = me.checkPointerToPx(px);  //在整条轨迹移动的像素
        curPointer = newTop - initPostion[1];   //当前指针所在位置,相对于播放轴起点位置
        //确定当前指正所在段
        var indAndInt = me.getPointSegmentOfPx(curPointer); // 获得当前指针所在段
        //找到当前的段索引
        var segIndex = indAndInt[0]; // 当前指针所在段索引
        var interval = indAndInt[1]; // 当前指针在当前段内的偏移量，如-10，表示在当前段从底部到上面10个像素
        result = [curPointer,segIndex];
        return result;
    }


    /**
     * 绘制进度条
     * @param px 浏览器的像素值
     */
    this.pointOnBrowser = function(px) {
        var result = getIndexByPx(px);
        var points = catchPoint(px);
        //段索引值
        var segIndex = result[1];
        //当前段轨迹的类型
        var type = segments[segIndex].type;
        //获取当前段的起点和距起点的距离
        var PX = points[1];
        //在浏览器下起点的像素值
        var beginPx = points[2] + EH;
        //在浏览器下段轨迹终点的像素值
        var endPx = points[3] + EH;
        //在浏览器下当前指针位置的像素值
        var pointPx = result[0] + EH;
        // var pointPx = EH;
        //轨迹段数量值
        var num = segments.length;
        return [segIndex,beginPx,endPx,pointPx,PX,segments[segIndex].height,type,num];
    }

    /**
     * 处理一条轨迹
     * @param SVG
     * @param height
     * @param index
     * @param beginPx
     * @param endPx
     * @param pointPx
     * @param px
     */
    this.progressBarSingle = function(SVG,height,index,beginPx,endPx,pointPx) {
        var normalPoint = d3.select("#normalPoint_" + index);
        normalPoint.remove();
        var Point = SVG.append("g").attr("id","normalPoint_" + index);
        Point.append("rect")
            .attr("x", 110)
            .attr("y", beginPx)
            .attr("width", "6px")
            .attr("height", height + "px")
            .attr("fill", "#acc5da");
        Point.append("rect")
            .attr("x", 110)
            .attr("y", 0)
            .attr("width", "6px")
            .attr("height", (pointPx-beginPx) + "px")
            .attr("fill", "#417ae1");
        Point.append("rect")
            .attr("x", 110)
            .attr("y", pointPx - EH)
            .attr("width", "6px")
            .attr("height", (endPx - pointPx)+"px")
            .attr("fill", "#acc5da");
    }


    /**
     * 在有多段轨迹时绘制进度条
     * @param SVG svg画布
     * @param height 子轨迹段的高度
     * @param index 段索引值
     * @param beginPx  段起点在浏览器上的位置
     * @param endPx  段终点在浏览器上的位置
     * @param pointPx  当前指针相对于浏览器的位置
     * @param px 指针相对于该段轨迹起点的距离
     * @param type 轨迹的类型
     */
    this.progressBar = function(SVG,height,index,beginPx,endPx,pointPx) {
        var normalPoint = d3.select("#normalPoint_" + index);
        normalPoint.remove();
        var Point = SVG.append("g").attr("id","normalPoint_" + index);
        Point.append("rect")
            .attr("x", 110)
            .attr("y", beginPx -EH)
            .attr("width", "6px")
            .attr("height", height + "px")
            .attr("fill", "#acc5da");
        Point.append("rect")
            .attr("x", 110)
            .attr("y", beginPx - EH)
            .attr("width", "6px")
            .attr("height", function() {
                var tmp = height - (pointPx - beginPx);
                 if (tmp <= 1) {
                    return height + "px";
                 }else {
                     return (pointPx-beginPx) + "px";
                 }
            })
            .attr("fill", "#417ae1");
        Point.append("rect")
            .attr("x", 110)
            .attr("y", pointPx - EH)
            .attr("width", "6px")
            .attr("height", function() {
                var tmp = endPx - pointPx;
                if (tmp <= 0.94) {
                    return 0 + "px";
                }else {
                    return (endPx - pointPx)+"px";
                }
            })
            .attr("fill", "#acc5da");
    }


    /**
     * 根据时间戳计算点的索引值
     * @param points   点的数组
     * @param ts   时间戳
     * @returns {number}
     */
    function getPoint(points,ts){
        var ind = -1;
        if(points && points.length > 0){
            for(var i = 0 ;i < points.length;i++){
                var p = points[i];

                if(Math.abs(p.sjc - ts) / 1000 < 1){
                    ind = i;
                    break;
                }
            }
        }
        return ind;
    }

    /**
     * 检查当前点所在的像素值
     * @param newTop
     * @returns {*}
     */
    this.checkPointerToPx = function (newTop) {
        var srcTop = initPostion[1], el = j$(selector);
        var max = (sumHeight + srcTop);
        if (newTop < srcTop) { // 防止向上越界
            newTop = srcTop;
        } else if (newTop > max) {      // 防止向下越界
            newTop = max;
        }

        return newTop;
    }

    /**
     * 检测当前所在点的时间戳
     * @param newTs
     * @returns {*}
     */
    this.checkPointerToTs = function (newTs) {
        var sTime = segments[0].startTime;
        var eTime = segments[segments.length - 1].endTime;
        if(newTs < segments[0].startTime){
            newTs = sTime;
        }else if(newTs > eTime){
            newTs = eTime;
        }

        return newTs;
    }

    /**
     * 给定时间戳移动到播放轴对应的位置
     * @param t 时间戳
     * @param segIndex 时间戳所在段索引 非必填
     */
    this.moveToTs = function (t,segIndex) {
        t = me.checkPointerToTs(t); // 检查边界,防止越界
        if(segIndex == undefined){
            segIndex =  me.getPointSegmentOfTs(t); // 获得当前指针所在段
        }

        try{
            var segment = segments[segIndex];
            var points = segment.showPt;
            var pointInd = getPoint(points,t);  // 计算点索引
            me.jump(segIndex, t);	// 跳转到给定段的给定时间
            
            var type = segment.type;
            // 判断该时间戳
            triggerNext(type,pointInd == -1 ? {sjc:t} : points[pointInd],type == 3 ? segment.offlineIndex : segment.location);
            return points;     //返回轨迹钟记录点的数组
        }catch(e){
            MXZH.errorLog(e);
        }
    }
    /**
     * 根据像素取播放轴轨迹段中距离该点最近的时间戳
     * @param pt
     */
    function getMinTsByPt(pt) {
        var results = [];      //存放（该点所处的像素值 - 每个时间戳对应的像素值）的数组
        var index = getPointSegmentOdPt(pt);        //得到该段所处的段的索引值
        var minIndex;    //results数组中最小值索引   -----> 相当于拿到段轨迹的所有点中距离当前点最近的索引值
        var ptArr = segments[index].showPt;
        for (var i = 0; i < ptArr.length; i ++) {
            var distanceTmp = getPtByTs(ptArr[i].sjc);
            results.push(Math.abs(pt - (distanceTmp + EH)));
        }
        //选择最小的数值为多少
        var min = results[0];
        for(var j = 0; j < results.length; j ++) {
            if (results[j] <= min) {
                min = results[j];
            }
        }
        //根据最小值得到在原数组中的那个位置 ---- >求索引下标
        results.forEach(function(value,inx) {
            if (min == value) {
                minIndex = inx;
            }
        });
        var minTs = ptArr[minIndex].sjc;         //最近时间戳值
        return [minTs,minIndex];     //时间戳和点的索引值数组
    }

    /***
     * 在给定移动像素的情况下获得对应的段
     *
     * @param px
     * @return [目标segment,相对于segment底部的偏移量]
     */
    this.getPointSegmentOfPx = function (px) {
        var result = [];

        var height = 0;
        for (var i = 0; i < segments.length; i++) {
            var seg = segments[i];
            height += seg.height;
            if (height - px >= 0) {
                var interval = px - height;
                result = [i, interval];
                break;
            }
        }

        if (height < px) {
            result = null;
        }

        return result;
    }

    /***
     * 给定时间戳的情况下获得对应的段索引
     *
     * @param px
     * @return {} 目标segment索引
     */
    this.getPointSegmentOfTs = function (ts) {
        var result = -1;
        for (var i = 0; i < segments.length; i++) {
            var seg = segments[i];
            if (ts >= seg.startTime && ts <= seg.endTime) {
                result = i;
                break;
            }
        }

        return result;
    }


    /**
     * 根据像素获取对应所处的轨迹段
     * @param pt
     * @returns {number}
     */
    function getPointSegmentOdPt(pt) {
        var result = -1;
        var heights = [];
        var trajHeight = 0;
        for (var i = 0; i < segments.length; i ++) {
            heights.push(segments[i].height);
        }
        for (var j = 0;j < heights.length; j ++) {
            trajHeight += heights[j];
            var tmp = pt - (trajHeight + EH);
            if (tmp <= 0) {
                result = j;
                break;
            }else {
                result = -1;
            }
        }
        return result;
    }


    /**
     *
     * var segment = {
	 *	startTime: 123444,//开始时间戳
	 *	endTime: 123500,//结束时间戳
	 *	type: 1,//1移动、2停留、3离线
	 *	height: 20,//以像素为单位
     *
     *
     *	   };
     * @type {string[]}
     */
    var playInd = [0,0];    // 当前播放位置索引  "段索引", "点索引"
    var playTask = null;    //  当前播放任务
    var playSpeed = 300;   // 当前播放速度,单位ms
    var playListeners = []; // 播放事件
    
    var finishListeners = []; // 结束事件
    this.onFinish = function(fn){
    	finishListeners.push(fn);
    };
    
    this.offFinish=function(fn){
        var ind = finishListeners.indexOf(fn);
        if(ind > -1){
        	finishListeners.slice(ind,ind); // 删除回调函数
        }
    }
    
    /**
     * 绑定next事件回调
     * */
    this.onNext=function(fn){
        playListeners.push(fn);
    };

    /**
     * 解除next事件回调
     * */
    this.offNext=function(fn){
        var ind = playListeners.indexOf(fn);
        if(ind > -1){
            playListeners.slice(ind,ind); // 删除回调函数
        }
    }

    /**
     * 触发事件
     * @param type 当前轨迹段类型
     * @param point 对应的当前轨迹点
     * @param indexInOrigin 当前轨迹段在原始轨迹数组中的索引
     * */
    function triggerNext(type,point,indexInOrigin){
    	//MXZH.log(type,point,indexInOrigin);
        for(var i = 0 ;i < playListeners.length;i++){
            var fn = playListeners[i];
            if(fn){
                fn(type,point,indexInOrigin);
            }
        }
    }
    
    /**
     * 触发事件 finish事件
     * */
    function triggerFinish(){
        for(var i = 0 ;i < finishListeners.length;i++){
            var fn = finishListeners[i];
            if(fn){
                fn();
            }
        }
    }


    /**
     * 处理播放时的进度条
     * @param segments   总轨迹数组
     * @param trajArr    子轨迹数组
     * @param ts   滑块所在位置对应的时间戳
     * @param height 该段轨迹的高度值
     * @param index 轨迹段索引
     */
    function progressBarOnPlay(segments,trajArr,ts,height,index) {
        var heightAll = segments.height;     //播放轴总长度
        var result = translateTrajToTs(segments,trajArr,ts,height);
        changeProgressBarStyle(result[0],result[4],result[3],result[1],result[2],index);
        return result;
    }

    /**
     * 根据轨迹段的时间戳转换进度条所需要的数据
     * @params 总轨迹数组集
     * @param trajArrs  每段轨迹数组
     * @param ts 现在点所在的时间戳
     * @param height 该段子轨迹的高度
     * @returns {Array}
     */
    function translateTrajToTs(segments,trajArr,ts,height) {
        var result = [],endPx;
        var ptArrs = trajArr.showPt;
        var beginTs = ptArrs[0].sjc;    //取轨迹段的开头时间戳
        var endTs = ptArrs[ptArrs.length - 1].sjc;   //取轨迹段结束时间戳
        var nowTs = ts;    //当前指针所在位置的时间戳
        var trajHeight = height;   //该轨迹段的高度值
        var beginPx = ((nowTs - beginTs)/(endTs - beginTs)) * trajHeight;    //根据时间戳计算当前点距该段轨迹起点的距离值
        var tmp_end = ((endTs - nowTs) / (endTs - beginTs)) * trajHeight;       //根据时间戳计算当前点距该段轨迹终点的距离值
        (tmp_end <= 0) ? endPx = 0 : endPx = tmp_end;
        var Pt = ((ts - segments[0].startTime) / (segments[segments.length - 1].endTime - segments[0].startTime)) * getAllHeight(segments);   //计算现在所在点时刻对应总轨迹起点的距离
        var beginPt = ((beginTs - segments[0].startTime) / (segments[segments.length - 1].endTime - segments[0].startTime)) * getAllHeight(segments); //子轨迹段起点所在播放轴上的位置
        result = [trajHeight,beginPx,endPx,Pt,beginPt];
        return result;
    }

    /**
     * 播放时进度条的样式改变
     * @param height   子轨迹的长度
     * @param beginPt  子轨迹起点的位置
     * @param nowPt    播放时点所处位置
     * @param beginPx  播放时滑块位置距子轨迹起点的距离
     * @param endPx    播放时滑块位置距子轨迹终点的距离
     * @param index   轨迹段索引
     */
    function changeProgressBarStyle(height,beginPt,nowPt,beginPx,endPx,index) {
        var SVG = d3.select("#svg");
        var normalPoint = d3.select("#normalPoint_" + index);
        normalPoint.remove();
        var Point = SVG.append("g").attr("id","normalPoint_" + index);
        Point.append("rect")
            .attr("x", 110)
            .attr("y", beginPt)
            .attr("width", "6px")
            .attr("height", height + "px")
            .attr("fill", "#acc5da");
        Point.append("rect")
            .attr("x", 110)
            .attr("y", beginPt)
            .attr("width", "6px")
            .attr("height", beginPx  + "px")
            .attr("fill", "#417ae1");
        Point.append("rect")
            .attr("x", 110)
            .attr("y", nowPt)
            .attr("width", "6px")
            .attr("height", endPx + "px")
            .attr("fill", "#acc5da");
    }



    /**
     * 处理type值为1的轨迹数据
     * @param trajs
     */
    function getTypeOfOne(trajs) {
        //将type为1的轨迹提取出来
        var trajArr = [];
        for (var i = 0; i < trajs.length; i ++) {
            if (trajs[i].type == 1) {
                var index = i;   //段的索引值
                var trajData = {   //构造的移动轨迹和索引值一起的数据结构
                    traj: trajs[i],
                    index: index
                };
                trajArr.push(trajData);
            }
        }
        return trajArr;
    }


    /**
     * 处理只含type值为1的轨迹数组
     */
    function operateTypeOfOne() {
        var result = [];
        var trajArr = getTypeOfOne(segments);          //所有移动子轨迹的数组
        var beginTsArr = [];           //存储每段子移动轨迹的起点时间戳数组
        var endTsArr = [];             //存储每段子移动轨迹的终点时间戳数组
        var heightArr = [];            //存储每段子移动轨迹的高度
        var indexArr = [];             //存放每段子轨迹对应的段索引
        for(var i = 0; i < trajArr.length; i ++) {   //拿到每段子移动轨迹的开头和结束时间戳
            var beginTs = trajArr[i].traj.startTime;
            var endTs = trajArr[i].traj.endTime;
            var height = trajArr[i].traj.height;
            var index = trajArr[i].index;
            beginTsArr.push(beginTs);
            endTsArr.push(endTs);
            heightArr.push(height);
            indexArr.push(index);
        }
        result = [beginTsArr,endTsArr,heightArr,indexArr];
        return result;
    }

    /**
     * 根据时间戳获取点在播放轴上的位置
     * @param ts   轨迹上的某点对应的时间戳
     */
    function getPtByTs(ts) {
        var beginAllTs = segments[0].startTime;    //总轨迹的开始时间戳
        var endAllTs = segments[segments.length - 1].endTime;    //总轨迹的结束时间戳
        var pt = ((ts - beginAllTs) / (endAllTs - beginAllTs)) * getAllHeight(segments);    //该点对应在播放轴的位置
        return pt;
    }


    /**
     * 去除在播放轴上的进度条
     */
    function clearProgressBar() {
        var dataArr = operateTypeOfOne();
        var beginTsArr = dataArr[0];           //存储每段子移动轨迹的起点时间戳数组
        var endTsArr = dataArr[1];             //存储每段子移动轨迹的终点时间戳数组
        var heightArr = dataArr[2];            //存储每段子移动轨迹的高度
        var indexArr = dataArr[3];             //存放每段子轨迹对应的段索引

        for (var i = 0; i < indexArr.length; i ++) {
            var index = indexArr[i];
            var height = heightArr[i];
            var beginPt = getPtByTs(beginTsArr[i]);
            clearProgressBarStyle(index,height,beginPt);
        }
    }


    /**
     * 在一段轨迹上填充颜色
     * @param beginPt  段轨迹开头时间戳
     * @param height  段轨迹高度值
     * @param index   段索引
     * @param color   沿填充的颜色值
     */
    function addColorOnTraj(beginPt,height,index,color) {
        var SVG = d3.select("#svg");
        var normalPoint = d3.select("#normalPoint_" + index);
        normalPoint.remove();
        var Point = SVG.append("g").attr("id","normalPoint_" + index);
        Point.append("rect")
            .attr("x", 110)
            .attr("y", beginPt)
            .attr("width", "6px")
            .attr("height", height + "px")
            .attr("fill", color);
    }

    /**
     * 将移动轨迹段全部重置成初始化的播放轴颜色
     * @param index 段索引
     * @param height 每个子轨迹段的高度
     * @param beginPt  每个子轨迹段的起点
     */
    function clearProgressBarStyle(index,height,beginPt) {
        var color = "#acc5da";
        addColorOnTraj(beginPt,height,index,color);
    }

    /**
     * 根据总轨迹数组计算轨迹高度
     * @param trajs
     * @returns {number}
     */
    function getAllHeight(trajs) {
        var height = 0;
        for (var i = 0; i < trajs.length; i ++) {
            height += trajs[i].height;
        }
        return height;
    }


    /**
     * 根据索引获取移动轨迹的开始和结束时间戳
     * @param inx  段索引
     */
    function getBeginAndEndTsByInx(inx) {
        //轨迹段起点和终点的时间戳数据结构
        var TsMSG;
        var list = [],message;
        var result = operateTypeOfOne();     //轨迹的type值为1的轨迹数组--->移动轨迹
        var beginTs = result[0];
        var endTs = result[1];
        var height = result[2];
        var index = result[3];
        for (var i = 0; i < beginTs.length; i ++) {
            TsMSG = {
                beginTs: beginTs[i],    //段轨迹起点时间戳
                endTs: endTs[i],      //端轨迹终点时间戳
                height: height[i],     //端轨迹高度
                index:index[i]        //段轨迹索引
            }
            list.push(TsMSG);
        }

        for (var j = 0; j < list.length; j ++ ) {
            if (inx == list[j].index) {
                message = list[j];
            }
        }
        return message;
    }


    /**
     * 根据开头时间戳、高度和颜色渲染一段轨迹
     * @param beginTs   段轨迹起点时间戳
     * @param height    段轨迹高度
     * @param color     变换的颜色值
     * @param index     段索引
     */
    function addColorByBeginTsInx(beginTs,height,index,color) {
        //计算该起点处在播放轴中的位置
        var beginPx = ((beginTs - segments[0].startTime) / (segments[segments.length - 1].endTime - segments[0].startTime)) * getAllHeight(segments);
        addColorOnTraj(beginPx,height,index,color);
    }


    /**
     * 根据移动索引渲染该段移动轨迹轨迹
     * @param inx 当前所处段的索引
     */
    this.addStyleByInx = function(inx) {
        var result = operateTypeOfOne();
        var inxArr = result[3];
        var color = "#acc5da";  //初始化颜色
        if (inxArr.length != 0) {
            if (inxArr.length > 1) {  //数组中元素至少两个 --->多段移动轨迹
                handleElementsOnInxArr(inx,inxArr,color);
            }else {  //数组中元素只有一个 --->一段移动轨迹
//               handleSingleElementOnInxArr(inx,inxArr,color);
            	handleElementsOnInxArr(inx,inxArr,color);
            }
        }
    }

    /**
     * 处理单个移动轨迹数组时的进度条样式
     * @param inx     所处段的索引
     * @param inxArr  轨迹数组
     * @param color   颜色值
     */
    function handleSingleElementOnInxArr(index,inxArr,color) {
        if (index > inxArr) {
            color = "#acc5da";    //灰色
        }else if (index < inxArr) {
            color = "#417ae1";   //蓝色
        }
        var message = getBeginAndEndTsByInx(inxArr);
        var beginTs = message.beginTs;
        var height = message.height;
        addColorByBeginTsInx(beginTs,height,inxArr,color);
    }


    /**
     * 处理多段移动轨迹数组时进度条样式
     * @param inx     所处段的索引
     * @param inxArr  轨迹数组
     * @param color   颜色值
     */
    function handleElementsOnInxArr(index,inxArr,color) {
        var finishArr = [],unfinishArr = [];   //存储已经完成和未完成轨迹段数组
        var flag = 0,checkFlag = 0;
        for (var i = 0; i < inxArr.length; i ++) {
            if (index > inxArr[i]) {
                finishArr.push(inxArr[i]);
                flag = 1;
                addColorToProgressBar(flag,checkFlag,finishArr,unfinishArr,color);
            }
            if (index < inxArr[i]) {
                if (i < inxArr.length - 1) {
                    for (var j = i; j < inxArr.length; j ++ ) {
                        unfinishArr.push(inxArr[j]);
                    }
                }else {
                    unfinishArr.push(inxArr[i]);
                }
                flag = 2;
                addColorToProgressBar(flag,checkFlag,finishArr,unfinishArr,color);
                break;
            }
            if (index == inxArr[i]) {  //处在移动轨迹上时
                flag = 0;
                if (i != inxArr.length - 1) {
                    for (var k =0; k < i; k ++) {
                        finishArr.push(inxArr[k]);
                        checkFlag = 1;
                        addColorToProgressBar(flag,checkFlag,finishArr,unfinishArr,color);
                    }
                    for (var s = i + 1; s < inxArr.length; s ++) {
                        unfinishArr.push(inxArr[s]);
                        checkFlag = 2;
                        addColorToProgressBar(flag,checkFlag,finishArr,unfinishArr,color);
                    }
                }
                break;
            }
        }

    }
    function addColorToProgressBar(flag,checkFlag,finishArr,unfinishArr,color) {
        switch (flag) {
            case 0:
                if (checkFlag == 1) {
                    color = "#417ae1";
                    addColorOnTrajs(finishArr,color);
                }
                if (checkFlag == 2) {
                    color = "#acc5da";
                    addColorOnTrajs(unfinishArr,color);
                }
                break;
            case 1:    //未进行完成的轨迹
                color = "#417ae1";
                addColorOnTrajs(finishArr,color);
                break;
            case 2:
                color = "#acc5da";
                addColorOnTrajs(unfinishArr,color);
                break;
        }
    }

    /**
     * 在多段轨迹数组上进行进度条的颜色渲染
     * @param trajs
     * @param color
     */
    function addColorOnTrajs(trajs,color) {
        for (var i = 0; i < trajs.length; i ++) {
            var message = getBeginAndEndTsByInx(trajs[i]);
            var beginTs = message.beginTs;
            var height = message.height;
            addColorByBeginTsInx(beginTs,height,trajs[i],color);
        }
    }


    /**
     *  获取拖动时页面滑块的值
     */
    function getPagePt() {
        //拿到页面的元素值
        var height = j$(selector).offset().top + 2;
        return height;
    }


    /**
     * 根据像素值保存当前点到当前点索引中来记录播放处
     * @param pt
     */
    function savePts(pt) {
        var tsInx = getMinTsByPt(pt);
        var ts = tsInx[0];   //当前点所对应的时间戳值
        var indxPt= tsInx[1];   //点的索引值
        var segIndex = getPointSegmentOdPt(pt);    //段索引
        return [ts,segIndex,indxPt];
    }


    /**
     * 实现将滑块拖动位置记录到播放事件中去
     * @returns {*[]}
     */
    function getPlayPt() {
        var pt = getPagePt();
        var tss = savePts(pt)
        var ts = tss[0];    //滑块所处的时间戳
        var index = tss[1];  //滑块所处的端索引
        var indexPt = tss[2];   //滑块所处的点的索引值
        console.log(ts + ">>>>>>>>" + index + ">>>>>>>" + indexPt );
        return [ts,index,indexPt];
    }


    /**
     * 播放事件
     * @private
     */
    function _play() {
        clearTimeout(playTask);
        var inter = 3; // 停留N个时间间隔
        var segIndex = playInd[0];          //播放轨迹段索引
        var segment = segments[segIndex];   //拿一段轨迹
        var type = segment.type;              //轨迹中点的类型值 1、移动 2、停留 3、离线
        switch (type) {
            case 3:   //为离线时候没有点，设置一个虚拟点
                var ts = 0;
                if(playInd[1] == 0){
                    ts = (segment.endTime + segment.startTime) / 2;        //虚拟点的时间戳
                }else if(playInd[1] < inter + 1){
                    break;
                }else if(playInd[1] == inter + 1){
                    ts = segment.endTime;        						   //虚拟点的时间戳
                }
                me.moveToTs(ts,segIndex);
                break;
            case 2: // 停留
            case 1: // 移动
                var points = segment.showPt;           //轨迹段里的每个停留点数组
                var point = points[playInd[1]];       //取轨迹中的每个停留点
                var ts = point.sjc;
                me.moveToTs(ts,segIndex);
                if (segment.type == 1) {   //为移动轨迹时才有进度条样式
                    progressBarOnPlay(segments,segment,ts,segment.height,segIndex);                //进度条在播放时的改变
                }
                break;
        }
        if(type == 1 || type == 2){  // 移动轨迹
            var points = segment.showPt;
            if(playInd[1] < points.length - 1){ // 当前段移动轨迹尚未播放完毕
                playInd[1]++;
            }else{
                playInd[0]++;   // 当前段播放完毕,移动到下一段的第一个点
                playInd[1] = 0;
            }
        } else {// 离线轨迹
            if(playInd[1] < inter + 1){
                playInd[1]++;
            }else if(playInd[1] == inter + 1){  // 当前段播放完毕,移动到下一段的第一个点
                playInd[0]++;
                playInd[1] = 0;
            }
        }
        try{
            var isEnded = isFinished();
            if(isEnded){
                me.pause(); // 结束
                triggerFinish(); // 触发结束事件
            }
        }catch(e){
            MXZH.errorLog(e);
        }
        
        if(_isplaying){
        	playTask = setTimeout(_play, playSpeed);
        }
    }

    /**
     * 确认播放是否完成
     * @returns {boolean}
     */
    function isFinished(){
        var flag = false;
        if(playInd[0] < segments.length){
            var segment = segments[playInd[0]];   //拿一段轨迹
            var type = segment.type;              //轨迹中点的类型值 1、移动 2、停留 3、离线
            if(type == 1 || type == 2){
                if(playInd[0] < segments.length && playInd[1] < segment.showPt.length){   // 判断播放是否结束

                }else{  // 如果所有段均完毕
                    flag = true;
                }
            }else{
                if(playInd[0] < segments.length){   // 不考虑是否有点，因为这些点是虚拟的
                }else{  // 如果所有段均完毕
                    flag = true;
                }
            }
        }else{
            flag = true;
        }

        return flag;
    }

    // 播放
    this.play = function () {
        var isEnded = isFinished();
        /*if(isEnded){
            me.reset();
        }*/
         //记录的滑块位置值
        var tmp = getPlayPt();
        playInd[0] = tmp[1];
        playInd[1] = tmp[2];
        
        if(playTask){
        	 this.pause();
        }
        _isplaying=true;
        playTask = setTimeout(_play, playSpeed);
    }

    // 暂停
    this.pause = function () {
    	clearTimeout(playTask);
    	_isplaying=false;
    }

    // 加速
    this.speedUp = function (speed,isPlay) {
        playSpeed = speed;
        me.pause();
        if(isPlay){
	        me.play();
        }
    }

    // 结束
    this.reset = function() {
        clearInterval(playTask);
        playInd = [0, 0]; // 恢复原始段，点
        me.jump(0, segments[0].startTime);  // 跳转至初始位置
        clearProgressBar();
    }

    this.addDebugListener = function(){
        //me.onNext( );
    }
}

