var obj_tools={
	//监听预加载
	documentReady:function(fn){
		if(document.addEventListener) document.addEventListener("DOMContentLoaded",fn,false);
		else{
			document.attachEvent("onreadystatechange",function(){
				if(document.readyState=="complete")
					fn&&fn();
			});
		}
	},
	//是否为父元素
	isParent:function(oParent,obj){
			while(obj){
				if(obj==oParent) return true;
				obj=obj.parentNode;
			}
			return false;
	},
	//鼠标移入
	mouseEnter:function(obj,fn){
		var _this=this;
		obj.onmouseover= function (e) {
			var ev=e||event;
			var formElm=ev.formElement||ev.relatedTarget;
			if(_this.isParent(this,formElm)) return true;
			fn&&fn();
		};
	},
	//鼠标移出
	mouseLeave:function(obj,fn){
		var _this=this;
		obj.onmouseout= function (e) {
			var ev=e||event;
			var toElm=ev.toElement||ev.relatedTarget;
			if(_this.isParent(this,toElm)) return true;
			fn&&fn();
		};
	},
	//插入节点之后
	insertAfter:function(prev,next){
		var parentE1=next.parentNode;
		if(parentE1.lastChild==next) parentE1.appendChild(prev);
		else parentE1.insertBefore(prev,next.nextSibling);
	},
	//千位分隔符
	thousand:function(str,num){
		var iNum = parseFloat(str).toFixed(num);		
		var st = iNum.substring(0,iNum.length);
		return st && st.toString().
			replace(/(\d)(?=(\d{3})+\.)/g,function(st){
				return st+",";
			});
	},
	//兼容写法获取class元素
	getByClass:function(oParent,cls){
		var arr=[]; //容器
		if(document.getElementsByClassName) return oParent.getElementsByClassName(cls);
		else{
			var aEl=oParent.getElementsByTagName('*');//所有标签
			for(var i=0;i<aEl.length;i++){
				if(aEl[i].className.indexOf(cls)!=-1) arr.push(aEl[i]);//向数组中添加
			}
			return arr;
		}
	},
	//读取样式
	getStyle:function(obj, styleName){
		var value=obj.currentStyle ? obj.currentStyle[styleName]:getComputedStyle(obj, false)[styleName];
		return styleName=='opacity' ? value=Math.round(parseFloat(value)*100):value=parseInt(value);
	},
	//移动框架
	moveScreen:function(obj,moveStyle,end,stopTime,fn){
	//距离=终点-起点;
	var start=this.getStyle(obj, moveStyle);//起点数值

	var dis=end-start;//距离 distance
	
	//定时器---------------------------------------------
	var count=parseInt(stopTime/30);////次数
	var n=0;//步进

	clearInterval(obj.timer);//使用对象属性，定义计时器变量
	
	obj.timer=setInterval(function(){
		n++;
		
		var a=1-n/count;  //a的值会越来越小
		var step_dis=start+dis*(1-a*a*a);
		
		if(moveStyle=='opacity'){//透明
			obj.style.filter='alpha(opacity:'+step_dis+')';
			obj.style.opacity=step_dis/100;
		}
		else{//其他
			obj.style[moveStyle]=step_dis+'px';
		}
		
		//取消定时器
		if(n==count){
			clearInterval(obj.timer);
			fn && fn();
		};
	
	 },30);
	},
	//获取json数据
	getJson:function(options){
		var xhr = this.createRequst();
		xhr.open(options.method,options.url,true);
		xhr.onreadystatechange=function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					//直接解析json类型，转换为对象或数组
					options.success(JSON.parse(xhr.responseText));
				}
			}else{
				options.success("服务器异常"+xhr.status);
			}
		}
		xhr.send(null);
	},
	//兼容性获取json
	createRequst:function(){
		var xhr;
		try {
			xhr = new XMLHttpRequest("");
		} catch (e){
			try{
				xhr=new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e){
				//更老的版本一般用这个方法
				xhr=new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		return xhr;
	}
};
