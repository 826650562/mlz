serverpath =location.host;//ip和端口号
Ourname=location.pathname.substr(0,location.pathname.indexOf('/home'))||location.pathname.substr(0,location.pathname.indexOf('/fhome'));//项目名称
var ARCGIS_JSAPI_VERSION="3.19";//GIS版本号
var HOSTNAME_AND_PATH_TO_JSAPI=serverpath+"/arcgis2/"//gis api 路径
var MAPAPI_URL="http://"+serverpath+Ourname;  //例如  /xxcj_zhd_mlight_1
var dojoConfig={
	parseOnLoad:true,
    packages: [{"name": "js","location": MAPAPI_URL+"/js"}]
};
//ArcGIS API
document.writeln("<link rel='stylesheet' type='text/css' href='http://"+HOSTNAME_AND_PATH_TO_JSAPI+"/dijit/themes/claro/claro.css'>");
document.writeln("<link rel='stylesheet' type='text/css' href='http://"+HOSTNAME_AND_PATH_TO_JSAPI+"/esri/css/esri.css'>");
document.writeln("<script type='text/javascript' src='http://"+HOSTNAME_AND_PATH_TO_JSAPI+"init.js'></script>");
//加载工具函数
/*document.writeln("<script type='text/javascript' src="+MAPAPI_URL+"/mx/map/wang/Util/wangUtil.js></script>");*/

//服务构件
document.writeln("<script type='text/javascript' src='"+MAPAPI_URL+"/mx/map/wang/Config.js'></script>");
document.writeln("<script type='text/javascript' src='"+MAPAPI_URL+"/mx/map/wang/Map.js'></script>");

//功能构件  全局引用 
/*document.writeln("<script type='text/javascript' src='"+MAPAPI_URL+"/mx/map/wang/Map/mark.js'></script>");*/
document.writeln("<script type='text/javascript' src='"+MAPAPI_URL+"/mx/map/wang/Map/Point.js'></script>");
document.writeln("<script type='text/javascript' src='"+MAPAPI_URL+"/mx/map/wang/Map/range.js'></script>");
/*document.writeln("<script type='text/javascript' src='"+MAPAPI_URL+"/mx/map/wang/Map/layerControler.js'></script>"); */
