/**
 * Created by mlight on 2017/11/25.
 */

/**
 * 历史轨迹播放轴初始化
 * @constructor
 */
function DrawAxis() {
	var _m = this;
	// 移动轨迹1，停留轨迹2,离线轨迹 3,
	var trajPointer = null;

	var leftTop = [],
		heightAll;

	this.setInitPosition = function(top, left, height) {
		leftTop = [ left, top ];
		heightAll = height;
	}

	this.initAxis = function(data) {

		var _s = this;



		//浏览器可视化窗口高度
		//var heightAll = $(window).height();

		//  var heightAll = getLineSize()[0];


		var dataArr = data.listMyTrac; //轨迹数组
		var gzdsl = data.showPt; //确定好轨迹点数量
		//整体时间戳差值
		var gjcnt = data.endTime - data.startTime;


		var bsvg = d3.select("#startPoint"); //选择开始
		var svg = d3.select("#content"); //选择播放轴
		var esvg = d3.select("#endPoint"); //选择结束

		var svg_data = svg.data(dataArr);


		var div_height = $(".begin").height();
		var Y_height = $("#startPoint").height();

		var lineLength = heightAll - div_height * 2;

		//添加一个svg画板
		var BSVG = bsvg.append("svg").attr("height", "29px");
		var SVG = svg.append("svg").attr("height", lineLength + "px").attr("id","svg"); //播放轴
		var ESVG = esvg.append("svg").attr("height", "29px");
		adjust();
		//显示起点
		printBeginPoint();
		//显示终点
		printEndPoint();

		var allSegments = [];
		var arr = [];
		arr.push(data);


		//对页面数据进行处理展示
		//判断有无轨迹数据
		if (dataArr.length > 0) {
			arr = handleOffLines(data.startTime, data.endTime); // 处理生成离线轨迹;

			for (var i = 0; i < arr.length; i++) {
				if (arr[i].type != 3) { // 非离线轨迹
					arr[i].allSub = handleStops(arr[i]); // 获得该段轨迹的所有子轨迹
				}
			}
			
			handleMidOfflinePt(arr); // 填充离线轨迹中心点
			 
			// 至此,每个轨迹都已经获得完整的子轨迹
		} else {
			arr[0].type = 3;
		}

		var ySum = 0;
		var inx = 0;
		for (var i = 0; i < arr.length; i++) {
			var tmpHeight = 0;
			if (arr[i].type == 3) { // 绘制离线轨迹
				tmpHeight = printOffLinePt(0, ySum, arr[i].startTime, arr[i].endTime,inx);
				inx ++ ;
				arr[i].height = tmpHeight;
				allSegments.push(arr[i]);
				ySum += tmpHeight;
				//MXZH.log(i, tmpHeight, new Date(arr[i].startTime), new Date(arr[i].endTime));
			} else {
				var subTrajs = arr[i].allSub;
				for (var j = 0; j < subTrajs.length; j++) {
					var subTraj = subTrajs[j];
					switch (subTraj.type) {
					case 1: // 移动轨迹
						tmpHeight = printNormalPt(0, ySum, subTraj.startTime, subTraj.endTime,inx);
						inx ++;
						subTraj.height = tmpHeight;
						ySum += tmpHeight;
						allSegments.push(subTraj);
					//	MXZH.log(i, tmpHeight, new Date(subTraj.startTime), new Date(subTraj.endTime));
						break;
					case 2: // 停留轨迹
						tmpHeight = printStopPt(0, ySum, subTraj.startTime, subTraj.endTime,inx);
						inx ++;
						subTraj.height = tmpHeight;
						ySum += tmpHeight;
						allSegments.push(subTraj);
					//	MXZH.log(i, tmpHeight, new Date(subTraj.startTime), new Date(subTraj.endTime));
						break;
					}
				}
			}
		}

		/**
		 * 计算离线轨迹中心点坐标
		 * */
		function handleMidOfflinePt(allSub) {
			var j = 0;
			for(var i = 0 ;i < allSub.length;i++){
				var curTraj = allSub[i];
				if(curTraj.type == 3){
					var prevTraj = allSub[i - 1]; //前一条轨迹, 相对于当前轨迹的前一条
					if(prevTraj && prevTraj.type != 3){
						var prevShowPt = prevTraj.showPt; // 前一条轨迹的所有点
						var prevLastPt = prevShowPt[prevShowPt.length - 1]; // 前一条轨迹的最后一个点
						
						var nextTraj = allSub[i+1]; //后一条轨迹，相对于当前轨迹的后一条
						if(nextTraj && nextTraj.type != 3){
							var nextShowPt = nextTraj.showPt; // 后一条轨迹的所有点
							var nextFirstPt = nextShowPt[0]; // 后一条轨迹的第一个点
							
							var x = ( prevLastPt.x + nextFirstPt.x ) / 2;
							var y = ( prevLastPt.y + nextFirstPt.y ) / 2;
							var sjc = ( prevLastPt.sjc + nextFirstPt.sjc ) / 2;
							
							curTraj.showPt = [{x:x,y:y,sjc:sjc}]; // 轨迹中间位置
							curTraj.offlineIndex = j;
						}
					}
					
					j++; // 设置当前轨迹索引
				}
			}
		}


		function initTrajPointer() {
			trajPointer = new TrajPointer();
			trajPointer.setSegments(allSegments);
			trajPointer.render(0, leftTop, lineLength);

			trajPointer.addDebugListener();
		}

		initTrajPointer()

		/**
		 * 处理结果直接插入到原始数据中
		 */
		function handleOffLines(sTime, eTime) { //离线点计算
			var result = [ data ];
			for (var i = 0; i < dataArr.length; i++) {
				var last = result.pop();
				sTime = last.startTime;
				eTime = last.endTime;

				var trajs = handleSingleOffLine(dataArr[i], sTime, eTime);

				for (var j = 0; j < trajs.length; j++) {
					trajs[j].location = i;
					result.push(trajs[j]);
				}
			}

			if (dataArr.length == 0) {
				result.type = 3;
			}

			return result;
		}


		function handleSingleOffLine(traj, sTime, eTime) {
			var result = [];
			var sInterval = (traj.startTime - sTime) / 1000,
				eInterval = (eTime - traj.endTime) / 1000;
			if (sInterval < 1) {
				if (eInterval < 1) {
					traj.type = 1; //定义type
					result.push(traj);
				} else {
					traj.type = 1;
					result.push(traj);

					var traj2 = {
						startTime : traj.endTime,
						endTime : eTime,
						type : 3 // 离线轨迹
					};
					result.push(traj2);
				}
			} else {
				if (eInterval < 1) {
					var traj1 = {
						startTime : sTime,
						endTime : traj.startTime,
						type : 3 // 运动轨迹
					};
					result.push(traj1);

					traj.type = 1;
					result.push(traj);
				} else {
					var traj1 = {
						startTime : sTime,
						endTime : traj.startTime,
						type : 3 // 运动轨迹
					};
					result.push(traj1);

					traj.type = 1;
					result.push(traj);

					var traj3 = {
						startTime : traj.endTime,
						endTime : eTime,
						type : 3 // 运动轨迹
					};
					result.push(traj3);
				}
			}
			return result;
		}

		/**
		 * 从点集合中找到对应时间戳范围内的点
		 * @param pt 点集合
		 * @param sTime 开始时间戳
		 * @param eTime 结束时间戳
		 * */
		function handlePt(pt, sTime, eTime) {
			var result = [];
			for (var i = 0; i < pt.length; i++) {
				var ts = pt[i].sjc;
				if (ts < sTime) {
					continue;
				}

				if (ts >= sTime && ts <= eTime) {
					result.push(pt[i]);
				}

				if (ts > eTime) {
					break;
				}
			}

			return result;
		}

		/**
		 * 停留点处理,使用stopTraj去切割去切割sTime,eTime
		 * @param stopTraj 当前停留轨迹
		 * @param sTime 当前停留轨迹所在轨迹段的开始时间
		 * @param eTime 当前停留轨迹所在轨迹段的结束时间
		 * @param pt 上层轨迹的showPt
		 */
		function handleSingleStop(stopTraj, sTime, eTime, pt) {
			var result = [];
			var sInterval = (stopTraj.startTime - sTime) / 1000,
				eInterval = (eTime - stopTraj.endTime) / 1000;
			if (sInterval == 0) {
				if (eInterval == 0) {
					stopTraj.type = 2; // 停留轨迹
					stopTraj.showPt = pt;
					result.push(stopTraj);
				} else {
					var traj1 = stopTraj;
					stopTraj.showPt = handlePt(pt, stopTraj.startTime, stopTraj.endTime);
					stopTraj.type = 2; // 停留轨迹
					result.push(traj1);

					var traj2 = {
						showPt : handlePt(pt, stopTraj.endTime, eTime),
						startTime : stopTraj.endTime,
						endTime : eTime,
						type : 1 // 移动轨迹
					};

					result.push(traj2);
				}
			} else {
				if (eInterval == 0) {
					var traj1 = {
						showPt : handlePt(pt, sTime, stopTraj.startTime),
						startTime : sTime,
						endTime : stopTraj.startTime,
						type : 1 // 运动轨迹
					};
					result.push(traj1);

					var traj2 = stopTraj;
					stopTraj.type = 2; // 停留轨迹
					stopTraj.showPt = handlePt(pt, stopTraj.startTime, stopTraj.endTime);
					result.push(traj2);
				} else {
					var traj1 = {
						showPt : handlePt(pt, sTime, stopTraj.startTime),
						startTime : sTime,
						endTime : stopTraj.startTime,
						type : 1 // 运动轨迹
					};
					result.push(traj1);

					var traj2 = stopTraj;
					stopTraj.type = 2; // 停留轨迹
					stopTraj.showPt = handlePt(pt, stopTraj.startTime, stopTraj.endTime);
					result.push(traj2);

					var traj3 = {
						showPt : handlePt(pt, stopTraj.endTime, eTime),
						startTime : stopTraj.endTime,
						endTime : eTime,
						type : 1 // 运动轨迹
					};
					result.push(traj3);
				}
			}
			return result;
		}

		// 针对1段轨迹中的多段停留轨迹
		function handleStops(subTraj) {
			var stopTrajs = subTraj.stopPt;
			var sTime = subTraj.startTime;
			var eTime = subTraj.endTime;
			var result = [ subTraj ];

			for (var i = 0; i < stopTrajs.length; i++) {
				var last = result.pop();
				sTime = last.startTime;
				eTime = last.endTime;
				var showPt = last.showPt;

				var tmp = handleSingleStop(stopTrajs[i], sTime, eTime, showPt);
				for (var j = 0; j < tmp.length; j++) {
					tmp[j].location = subTraj.location ;
					result.push(tmp[j]);
				}
			}
			return result;
		}


		function adjust(){
			adjustTime();
		}
		
		/**
		 * 调整停留轨迹顺序
		 * */
		function adjustStopOrder(stopPts){
			if(stopPts){
				stopPts.sort(function(a,b){
					return a.sjc - b.scj;
				})
			}
		}
		
		/** 针对每段轨迹做时间对齐 */
		function adjustTime() {
			for (var i = 0; i < dataArr.length; i++) {
				var traj = dataArr[i];
				var firstTs = traj.showPt[0].sjc;
				var endTs = traj.showPt[traj.showPt.length - 1].sjc;
				traj.startTime = firstTs;
				traj.endTime = endTs;

				// 如果当前轨迹有停留点
				var stopPts = traj.stopPt;
				for (var j = 0; j < stopPts.length; j++) {
					var stopPt = stopPts[j];

					var stopsTime = stopPt[0].sjc;
					var stopeTime = stopPt[stopPt.length - 1].sjc;

					stopPts[j] = {
						showPt : stopPt,
						startTime : stopsTime,
						endTime : stopeTime
					};
				}
				
				adjustStopOrder(stopPts); // 将所有停留轨迹按照时间升序排列
				
				if(stopPts.length > 0){	// 使用停留轨迹修正当前轨迹的开始时间和结束时间
					traj.startTime = Math.min(traj.startTime,stopPts[0].startTime);
					traj.endTime = Math.max(traj.endTime,stopPts[stopPts.length - 1].endTime);
				}
			}
			
			if (dataArr.length > 0) {
				var endShowPt = dataArr[dataArr.length - 1].showPt;
				data.startTime = dataArr[0].startTime;
//				data.endTime = dataArr[dataArr.length - 1].endTime;
				data.endTime = endShowPt[endShowPt.length - 1].sjc;
			}
		}

		/**
		 * 正常轨迹绘制图
		 * @param x
		 * @param y
		 * @param sTime
		 * @param eTime
		 * @returns {number}
		 */
		function printNormalPt(x, y, sTime, eTime,index) {
			var normalPoint = SVG.append("g").attr("id", "normalPoint_" + index);
			var height = lineLength * bili(sTime, eTime);
			normalPoint.attr("transform", "translate(" + x + "," + y + ")");
			normalPoint.append("rect")
				.attr("x", 110).attr("y", 0)
				.attr("width", "6px")
				.attr("height", height + "px")
				.attr("fill", "#acc5da");

			return height;
		}


		/**
		 * 离线点绘制图
		 * @param x
		 * @param y
		 * @param startTime
		 * @param endTime
		 * @returns {number}
		 */
		function printOffLinePt(x, y, startTime, endTime,index) {
			var Pt = SVG.append("g").attr("id", "offPoint_" + index);
			Pt.attr("transform", "translate(" + x + "," + y + ")");

            var cnt = 0;
            var myHeight = (endTime - startTime) / (data.endTime - data.startTime) * lineLength;
            var counter = Math.floor(myHeight / 6);

			if (myHeight > 10) {
                Pt.append("text").attr("x", 68).attr("y", 5).attr("font-size", "12px").attr("fill", "#96b4ce").attr("text-anchor", "middle").text(getSingleTime(startTime));
                Pt.append("line").attr("x1", 115).attr("y1", 1).attr("x2", 95).attr("y2", 1).attr("stroke", "#96b4ce").attr("stroke-width", "1px");
			}

			//console.info(myHeight % 6);
			for (var i = 0; i < counter + 1; i++) {
				cnt = i * 6;
				if (i == counter) {
					if(myHeight % 6 < 6) {
					
						var tmpHeight = (counter * 6) + (myHeight % 6) - counter * 6;
						//MXZH.log(tmpHeight);
						if (tmpHeight >= 3 ) {
							Pt.append("rect").attr("x", 110).attr("y", counter * 6 ).attr("width", "6px").attr("height", "3px").attr("fill", "#96b4cc");
						}else {
							Pt.append("rect").attr("x", 110).attr("y", counter * 6).attr("width", "6px").attr("height", tmpHeight + "px").attr("fill", "#96b4cc");
						}
					}
				} else {
					Pt.append("rect").attr("x", 110).attr("y", cnt).attr("width", "6px").attr("height", "3px").attr("fill", "#96b4cc");
				}
			}

			if (myHeight > 10) {
                Pt.append("line").attr("x1", 115).attr("y1", counter * 6 + (myHeight % 6)).attr("x2", 95).attr("y2", counter * 6 + (myHeight % 6)).attr("stroke", "#96b4ce").attr("stroke-width", "1px");
                Pt.append("text").attr("x", 68).attr("y", counter * 6 + 9).attr("font-size", "12px").attr("fill", "#96b4ce").attr("text-anchor", "middle").text(getSingleTime(endTime));
			}


			var height = counter * 6 + (myHeight % 6);
			return height;
		}


		/**
		 * 停留点绘制图
		 * @param x
		 * @param y
		 * @param sTime
		 * @param eTime
		 * @returns {number}
		 */
		function printStopPt(x, y, sTime, eTime,index) {
			var normalPoint = SVG.append("g").attr("id", "stopPoint_"+ index);
			var height = lineLength * bili(sTime, eTime);
			normalPoint.attr("transform", "translate(" + x + "," + y + ")");
			normalPoint.append("rect")
				.attr("x", 110).attr("y", 0)
				.attr("width", "6px")
				.attr("height", height + "px")
				.attr("fill", "#d85020");
			return height;
		}


		/**
		 * 绘制起点
		 */
		function printBeginPoint() {
			var Pt = BSVG.append("g").attr("id", "beginPoint_" + new Date().getTime());
			Pt.append('path').attr('d', 'M110 5 L35 5 A6 6 0 0 0 35 26 L110 26').attr('stroke', '#3dd125').attr('stroke-width', '1').attr('fill', '#f0feed');
			Pt.append("circle").attr('cx', '112').attr('cy', '15').attr('r', '15').attr('fill', '#3dd125').attr('stroke', '#fff').attr('stroke-width', '2');
			Pt.append('text').attr('x', '112').attr('y', '20').attr('font-size', '15px').attr('fill', '#fff').attr('text-anchor', 'middle').attr('font-family', 'Microsoft YaHei').text("起");
			Pt.append('text').attr('x', '66').attr('y', '19').attr('font-size', '12px').attr('fill', '#222222').attr('text-anchor', 'middle').attr('font-family', 'Microsoft YaHei').text(getSingleTime(data.startTime));
		}

		/**
		 * 绘制终点
		 */
		function printEndPoint() {
			var endShowPt = dataArr[dataArr.length - 1].showPt;

//			data.endTime = dataArr[dataArr.length - 1].endTime;
			var endT = endShowPt[endShowPt.length - 1].sjc;
			var Pt = ESVG.append("g").attr("id", "endPoint_" + new Date().getTime());
			Pt.append('path').attr('d', 'M110 5 L35 5 A6 6 0 0 0 35 26 L110 26').attr('stroke', '#d85020').attr('stroke-width', '1').attr('fill', '#fef3ef');
			Pt.append("circle").attr('cx', '115').attr('cy', '15').attr('r', '15').attr('fill', '#d85020').attr('stroke', '#fff').attr('stroke-width', '2');
			Pt.append('text').attr('x', '115').attr('y', '20').attr('font-size', '15px').attr('fill', '#fff').attr('text-anchor', 'middle').attr('font-family', 'Microsoft YaHei').text("终");
			Pt.append('text').attr('x', '66').attr('y', '19').attr('font-size', '12px').attr('fill', '#222222').attr('text-anchor', 'middle').attr('font-family', 'Microsoft YaHei').text(getSingleTime(endT));
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
		 * 时间戳(1511609136846)转换成日期加时分秒(2017-11-25 19:25:36)
		 * @param time
		 * @returns {*}
		 */
		function getDateAndTime(time) {
			return transFormAndFormat(time, 'yyyy-MM-dd hh:mm:ss');
		}

		/**
		 * 时间格式转换
		 * @param time
		 * @param format
		 */
		function transFormAndFormat(time, format) {
			Date.prototype.format = function(format) {
				var date = {
					"M+" : this.getMonth() + 1,
					"d+" : this.getDate(),
					"h+" : this.getHours(),
					"m+" : this.getMinutes(),
					"s+" : this.getSeconds(),
					"q+" : Math.floor((this.getMonth() + 3) / 3),
					"S+" : this.getMilliseconds()
				};
				if (/(y+)/i.test(format)) {
					format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(3 - RegExp.$1.length));
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
		 * 根据时间刻度计算比例
		 * @param startTime
		 * @param endTime
		 * @returns {number}
		 */
		function bili(startTime, endTime) {
			return (endTime - startTime) / (data.endTime - data.startTime);
		}


		/**
		 * 根据浏览器窗口获取播放轴的高度
		 * @returns {*[]}
		 */
		function getLineSize() {
			// 通过深入 Document 内部对 body 进行检测，获取窗口大小
			var winHeight = 0,
				winWidth = 0;
			if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
				winHeight = document.documentElement.clientHeight;
				winWidth = document.documentElement.clientWidth;
			}
			return [ winHeight, winWidth ];
		}



		var box = document.getElementById("slider");
		var dragging = false;
		var boxX, boxY, mouseX, mouseY, offsetX, offsetY;

		var oldTop,oldClientY;

		/**
		 * 获取鼠标位置函数
		 * @param e
		 * @returns {{x: number, y: number}}
         */
		function getMouseXY(e) {
			var x = 0, y = 0;
			e = e || window.event;
			if (e.pageX) {
				x = e.pageX;
				y = e.pageY;
			} else {
				x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
				y = e.clientY + document.body.scrollTop - document.body.clientTop;
			}
			return {
				x: x,
				y: y
			};
		}


		/**
		 * mouseDown触发的函数
		 * @param e
         */
		function down(e) {
			dragging = true;
			boxX = box.offsetLeft;
			boxY = box.offsetTop;
			mouseX = parseInt(getMouseXY(e).x);
			mouseY = parseInt(getMouseXY(e).y);
			offsetX = mouseX - boxX;
			offsetY = mouseY - boxY;

			oldClientY = e.clientY;
			oldTop = parseInt($(this).css('top'));

		}


		/**
		 * mousemove触发的函数
		 * @param e
         */
		function move(e) {
			if (dragging) {
				//var x = getMouseXY(e).x - offsetX;
				var y = getMouseXY(e).y - offsetY;
				//var width = document.documentElement.clientWidth - box.offsetWidth;
				var width = leftTop[0];
				var height = document.documentElement.clientHeight - box.offsetHeight;
				//x = Math.min(Math.max(0, x), width);
				var x = width;
				y = Math.min(Math.max(0, y), height);
				box.style.left = x + 'px';
				box.style.top = y + 'px';

				//滑块移动时相关的数据处理
				var newClientY = e.clientY;
				var yInterval = newClientY - oldClientY; // 移动的像素
				var newTop = oldTop + yInterval;
				trajPointer.moveToPx(newTop);
				var result = trajPointer.pointOnBrowser(newTop);
				//console.log(result);
                var inx = result[0];     //段的索引值
				if (result[6] == 1 && result[7] == 1) {   //为移动轨迹时执行进度条事件
					trajPointer.progressBar(SVG,result[5],result[0],result[1],result[2],result[3]);
				}else if (result[7] > 1){
					if (result[6] == 1) {
                        trajPointer.progressBar(SVG,result[5],result[0],result[1],result[2],result[3]);
					}
                    trajPointer.addStyleByInx(inx);   //消除拖放播放轴时事件反应不过来造成的样式误差
                }
				trajPointer.pause();
				$(".play_box").attr("_type", 'parse');
				$(".play_box").css("background", "url(./mx/lsgj/images/playbtn.png)");

			}
		}

		/**
		 * mouseup触发的函数
		 * @param e
         */
		function up(e) {
			dragging = false;
		}

		/*function out(e) {
			dragging = false;
		}*/




		_s.moveMouse = function() {
			try {
				box.onmousedown = down;
				document.onmousemove = move;
				document.onmouseup = up;
				//document.onmouseout = out;
				down(e);
				move(e);
				up(e);
				getMouseXY(e);
				//out(e);
			} catch(err) {

			}

		}



		/**
		 * 滑块移动
		 */
		/*_s.moveMouse = function() {
			$(".slider-thumb").mousedown(function(evt) {
				var that = this;
				var oldClientY = evt.clientY;
				var oldTop = parseInt($(this).css('top'));

				$(".slider-thumb").mousemove(function(evt) {

					var newClientY = evt.clientY;
					var yInterval = newClientY - oldClientY; // 移动的像素

					var newTop = oldTop + yInterval;

					trajPointer.moveToPx(newTop);
					var result = trajPointer.pointOnBrowser(newTop);
					MXZH.log(result);
					if (result[6] == 1) {
						trajPointer.progressBar(SVG,result[5],result[0],result[1],result[2],result[3],result[4]);
					}

					trajPointer.pause();
					$(".play_box").attr("_type", 'parse');
					$(".play_box").css("background", "url(./mx/lsgj/images/playbtn.png)");

				});
			});
			$(".slider-thumb").mouseout(function(){
				$(".slider-thumb").off("mousemove");
			});
			$(".slider-thumb").mouseup(function(evt) {
				$(".slider-thumb").off("mousemove");
				$(document).off("mousedown");
			});
			
			
		}*/

		this.getPointer = function() {
			return trajPointer;
		}
		
	}
	
	/**
	 * 隐藏svg绘制的播放轴
	 * @private
     */
	function _clear(){
		$("#all").find("svg").remove();
		//d3.selectAll("svg").remove();
	}

	this.clear = function(){
		$(".slider-thumb").remove();
		var node = d3.selectAll("svg");
		if (node != null) {
			_clear();
		}
	}
}