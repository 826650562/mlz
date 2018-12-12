package cn.mlight.action;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;
//import org.bouncycastle.jcajce.provider.asymmetric.EC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsTemplate;

import com.google.gson.JsonArray;
import com.mlight.bridge.UploadBridge;
import com.mlight.jms.TextMessageCreator;
/*import com.mlight.jni.LogClient;*/
import com.opensymphony.xwork2.ActionSupport;

import cn.mlight.domain.HistoryMsgPo;
import cn.mlight.domain.Message;
import cn.mlight.domain.MessageModel;
import cn.mlight.domain.Tzgg;
import cn.mlight.domain.User;
import cn.mlight.listener.SessionUtil;
import cn.mlight.service.MapService;
import cn.mlight.service.MessageService;
import cn.mlight.service.TzggService;
import cn.mlight.utils.Create_QR;
import cn.mlight.utils.EncryptUtils;
import cn.mlight.utils.FFMpegUtil;
import cn.mlight.utils.PageBean;
import cn.mlight.utils.transUtils;
import it.sauronsoftware.jave.EncoderException;
import net.coobird.thumbnailator.Thumbnails;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class HomeAction extends ActionSupport {
	@Value("#{settingProperties['ffmpeg.path']}")
	private String ffmpeg;

	@Value("#{settingProperties['encrypt.key']}")
	private String key;

	@Value("#{settingProperties['uploadUrls']}")
	private String uploadUrls;
	@Value("#{settingProperties['appUrl']}")
	private String appUrl;
	@Value("#{settingProperties['fdfsUrl']}")
	private String fdfsUrl;

	@Resource
	private UploadBridge uploadBridge;

	@Resource
	private MessageService messageService;
	@Resource
	private TzggService tzggService;
	@Resource
	private MapService mapService;
/*	private static final LogClient logClient = LogClient.getInstance();*/
	public MessageModel mm = new MessageModel();
	public Message ms = new Message();
	private List<Message> messageList;
	private PageBean<HistoryMsgPo> pb;
	private PageBean<Message> mpb;
	private PageBean<Tzgg> tpb;
	public Integer pageNo;
	private List<Message> contextList;
	private String sender;
	private String receiver;

	private String ls_startTime;
	private String ls_endTime;
	private String ls_conditions;
	private String groupid;
	private Integer pageSize;
	private String searchString = "";
	private String startTime = "";
	private String endTime = "";

	private String LayerPath = "";
	private String name = "";
	private String miaoshu = "";
	private String creater = "";
	private String createrdate = "";
	private File file;
	private String fileFileName;
	private String typeId;
	private String polygon;
	private String distance;
	private String point;

	private String GztcBeginDate;
	private String GztcEndDate;
	private String Gztcnr;
	private String img_url;
	
	private String _gsName;
	private String _city;
	
	private String _rodaName;

	/*
	 * 以下是 警戒区域所需字段
	 */

	public String get_rodaName() {
		return _rodaName;
	}

	public void set_rodaName(String _rodaName) {
		this._rodaName = _rodaName;
	}

	public String get_gsName() {
		return _gsName;
	}

	public void set_gsName(String _gsName) {
		this._gsName = _gsName;
	}

	public String get_city() {
		return _city;
	}

	public void set_city(String _city) {
		this._city = _city;
	}

	private String type = "";// 类型
	private String outLength = "";// 外面长度
	private String jjqy_otherText = "";// 备注信息
	private String jjqyName = "";// 警戒名称
	private String inLength = "";// 核心长度
	private String end_date = "";// 结束时间
	private String beginDate = "";// 开始时间
	private String bufferOut = "";// 外部layer字符串
	private String bufferOrigin = "";// 中间layer字符串
	private String bufferIn = "";// 内部layer字符串

	public String getImg_url() {
		return img_url;
	}

	public void setImg_url(String img_url) {
		this.img_url = img_url;
	}

	private Integer yyqy_pageNO;

	public Integer getYyqy_pageNO() {
		return yyqy_pageNO;
	}

	public void setYyqy_pageNO(Integer yyqy_pageNO) {
		this.yyqy_pageNO = yyqy_pageNO;
	}

	private String currentpageNo = "";
	private String everyPages = "";

	public String getType() {
		return type;
	}

	public String getPoint() {
		return point;
	}

	public void setPoint(String point) {
		this.point = point;
	}

	public String getGztcBeginDate() {
		return GztcBeginDate;
	}

	public void setGztcBeginDate(String gztcBeginDate) {
		GztcBeginDate = gztcBeginDate;
	}

	public String getGztcEndDate() {
		return GztcEndDate;
	}

	public void setGztcEndDate(String gztcEndDate) {
		GztcEndDate = gztcEndDate;
	}

	public String getGztcnr() {
		return Gztcnr;
	}

	public void setGztcnr(String gztcnr) {
		Gztcnr = gztcnr;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getOutLength() {
		return outLength;
	}

	public void setOutLength(String outLength) {
		this.outLength = outLength;
	}

	public String getJjqy_otherText() {
		return jjqy_otherText;
	}

	public void setJjqy_otherText(String jjqy_otherText) {
		this.jjqy_otherText = jjqy_otherText;
	}

	public String getJjqyName() {
		return jjqyName;
	}

	public void setJjqyName(String jjqyName) {
		this.jjqyName = jjqyName;
	}

	public String getInLength() {
		return inLength;
	}

	public void setInLength(String inLength) {
		this.inLength = inLength;
	}

	public String getEnd_date() {
		return end_date;
	}

	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}

	public String getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}

	public String getBufferOut() {
		return bufferOut;
	}

	public void setBufferOut(String bufferOut) {
		this.bufferOut = bufferOut;
	}

	public String getBufferOrigin() {
		return bufferOrigin;
	}

	public void setBufferOrigin(String bufferOrigin) {
		this.bufferOrigin = bufferOrigin;
	}

	public String getBufferIn() {
		return bufferIn;
	}

	public void setBufferIn(String bufferIn) {
		this.bufferIn = bufferIn;
	}

	public String getDistance() {
		return distance;
	}

	public void setDistance(String distance) {
		this.distance = distance;
	}

	private String fileFileURL;

	public String getFileFileURL() {
		return fileFileURL;
	}

	public void setFileFileURL(String fileFileURL) {
		this.fileFileURL = fileFileURL;
	}

	public String getMyFileName() {
		return myFileName;
	}

	public void setMyFileName(String myFileName) {
		this.myFileName = myFileName;
	}

	private String myFileName;

	public String getTypeId() {
		return typeId;
	}

	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public String getFileFileName() {
		return fileFileName;
	}

	public void setFileFileName(String fileFileName) {
		this.fileFileName = fileFileName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMiaoshu() {
		return miaoshu;
	}

	public void setMiaoshu(String miaoshu) {
		this.miaoshu = miaoshu;
	}

	public String getCreater() {
		return creater;
	}

	public void setCreater(String creater) {
		this.creater = creater;
	}

	public String getCreaterdate() {
		return createrdate;
	}

	public void setCreaterdate(String createrdate) {
		this.createrdate = createrdate;
	}

	public String getGroupid() {
		return groupid;
	}

	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}

	public String getLs_startTime() {
		return ls_startTime;
	}

	public void setLs_startTime(String ls_startTime) {
		this.ls_startTime = ls_startTime;
	}

	public String getLs_endTime() {
		return ls_endTime;
	}

	public void setLs_endTime(String ls_endTime) {
		this.ls_endTime = ls_endTime;
	}

	public String getLs_conditions() {
		return ls_conditions;
	}

	public void setLs_conditions(String ls_conditions) {
		this.ls_conditions = ls_conditions;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getReceiver() {
		return receiver;
	}

	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}

	public String home() {

		return "home";
	}
	public String fhome() {

		return "fhome";
	}

	/**
	 * @return the searchString
	 */
	public String getSearchString() {
		return searchString;
	}

	/**
	 * @param searchString
	 *            the searchString to set
	 */
	public void setSearchString(String searchString) {
		this.searchString = searchString;
	}

	/**
	 * @return the startTime
	 */
	public String getStartTime() {
		return startTime;
	}

	/**
	 * @param startTime
	 *            the startTime to set
	 */
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	/**
	 * @return the endTime
	 */
	public String getEndTime() {
		return endTime;
	}

	/**
	 * @param endTime
	 *            the endTime to set
	 */
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	// ApplicationContext ac = new
	// ClassPathXmlApplicationContext("applicationContext.xml");
	// private JmsTemplate sende = (JmsTemplate)ac.getBean("appJmsSendTempl");

	@Resource
	private JmsTemplate appJmsSendTempl;

	/**
	 * 查询消息历史记录
	 */
	public void queryContext() {
		/*
		 * pb =
		 * messageService.findContexts(this.getSender(),this.getReceiver());
		 */
		String startTime = ls_startTime;
		String endTime = ls_endTime;
		mpb = messageService.findContexts(sender, receiver, startTime, endTime, pageNo);
		JSONArray json1 = JSONArray.fromObject(mpb);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 查询群组详细信息
	 */
	public void queryQzContext() {
		/*
		 * pb =
		 * messageService.findContexts(this.getSender(),this.getReceiver());
		 */
		String startTime = ls_startTime;
		String endTime = ls_endTime;
		mpb = messageService.findQzContexts(groupid, startTime, endTime, pageNo);
		JSONArray json1 = JSONArray.fromObject(mpb);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		//System.out.println(String.valueOf(json1));
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	
	
	/**
	 * 查询街道名称
	 */
	public void getQy_jiedao() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		JSONObject obj = new JSONObject();
	    String Sql = " SELECT name,code FROM  sys_area  ";
 
	    List res = this.mapService.getListBySql(Sql);
		JSONArray json2 = JSONArray.fromObject(res);
		
		Sql = " SELECT name FROM  sys_road  ";
		List roadList = this.mapService.getListBySql(Sql);
		JSONArray json = JSONArray.fromObject(roadList);
		
		obj.put("jiedao", json2);
		obj.put("roadArr",json);
		//System.out.println(String.valueOf(json2));
		try {
			response.getWriter().write(String.valueOf(obj));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void get_fenji() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		JSONObject obj = new JSONObject();
	    String Sql = " SELECT count(*) FROM t_qyxx_yqyd WHERE qyfj = 'A';";
	    int res = this.mapService.countAll(Sql);
		
		
		String Sql1 = " SELECT count(*) FROM t_qyxx_yqyd WHERE qyfj = 'B';";
	    int res1 = this.mapService.countAll(Sql1);
		
		
		String Sql2 = " SELECT count(*) FROM t_qyxx_yqyd WHERE qyfj = 'C';";
	    int res2 = this.mapService.countAll(Sql2);
		
		
		String Sql3 = " SELECT count(*) FROM t_qyxx_yqyd WHERE qyfj = 'D';";
	    int res3 = this.mapService.countAll(Sql3);
		
		
		obj.put("fenjiA", res);
		obj.put("fenjiB", res1);
		obj.put("fenjiC", res2);
		obj.put("fenjiD", res3);
		//System.out.println(String.valueOf(json2));
		try {
			response.getWriter().write(String.valueOf(obj));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 *  查询复查数和安全次数
	 */
	public void queryAQJCFCS() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		
	  //  String Sql = "select count(1) ct from t_ydjd_xcjx t where t.bjcqyid= "+typeId+" UNION ALL select  IFNULL(sum(ljfccs),0) ct2  from t_ydjd_xcfx t  where t.bjcqyid="+typeId+"";
		String Sql = "select count(1),count(1) ct from dual";
	    List res = this.mapService.getListBySql(Sql);
		JSONArray json2 = JSONArray.fromObject(res);
		//System.out.println(String.valueOf(json2));
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 *   故事地图
	 */
	public void queryGSDT() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
	    String Sql = "select   t1.* ,t2.location_x,t2.location_y,DATE_FORMAT(t1.create_date,'%Y-%m-%d %T') as create_dateStr from t_ydjd_xcjx  t1  JOIN  t_basic_information t2  on t1.bjxqy=t2.enterprise_name where datediff(CURDATE(), t1.create_date )=1    ORDER BY t1.create_date ";
	    List res = this.mapService.getListBySql(Sql);
		JSONArray json2 = JSONArray.fromObject(res);
		//System.out.println(String.valueOf(json2));
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	
//
	
	
	
	/**
	 * 查询对话列表
	 */
	public void queryByList() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String startTime = ls_startTime;
		String endTime = ls_endTime;
		/*
		 * if (startTime != null && !startTime.equals("")) { startTime =
		 * startTime.replace("-", ""); startTime = startTime.replace(" ", "");
		 * startTime = startTime.replace(":", ""); } if (endTime != null &&
		 * !endTime.equals("")) { endTime = endTime.replace("-", ""); endTime =
		 * endTime.replace(" ", ""); endTime = endTime.replace(":", ""); }
		 */
		pb = messageService.findByMessage(startTime, endTime, ls_conditions, pageNo, pageSize);
		ServletActionContext.getRequest().setAttribute("pb", pb);
		JSONArray json2 = JSONArray.fromObject(pb);
		//System.out.println(String.valueOf(json2));
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	// 查询历史轨迹分页信息 by wxl

	public void querylsgjBytimeAndName() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " SELECT * FROM t_location t WHERE t.standard_time >='" + startTime + "'  and  t.standard_time <='"
					+ endTime + "'  GROUP BY name  ";
		} else {
			Sql = " SELECT * FROM t_location t WHERE (name like '%" + searchString + "%' or group_name like  '%"
					+ searchString + "%') and  t.standard_time >='" + startTime + "'  and  t.standard_time <='"
					+ endTime + "'  GROUP BY name  ";
		}
		List res = this.mapService.getListBySql(Sql);
		// System.out.println(res);
		// fenzu
		Map NameMap = new HashMap();
		List name = new ArrayList();
		List l = new ArrayList();
		for (int i = 0; i < res.size(); i++) {
			Map m = (Map) res.get(i);
			String n = (String) m.get("name");
			if (!name.contains(n)) {
				name.add(n);
			}
		}
		for (int i = 0; i < name.size(); i++) {
			List suzu = new ArrayList();
			for (int j = 0; j < res.size(); j++) {
				Map m = (Map) res.get(j);
				String n = (String) m.get("name");
				if (StringUtils.equals((String) name.get(i), n)) {
					suzu.add(res.get(j));
				}
			}
			NameMap.put(name.get(i), suzu);
		}
		// System.out.println(NameMap);

		JSONArray json2 = JSONArray.fromObject(NameMap);
		// System.out.println(json2.toString());
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 查询巡逻路线信息@SteveChan
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void queryForXLLX() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " SELECT * from t_xllx where del_flag = 0 order by id desc ";
		}
		List res = this.mapService.getListBySql(Sql);
		List routelist = new ArrayList();
		for (int i = 0; i < res.size(); i++) {
			Map m = (Map) res.get(i);
			List route = new ArrayList();
			Map NameMap = new HashMap();
			route.add(m.get("name"));
			route.add(m.get("miaoshu"));
			route.add(m.get("_creater"));
			String date = m.get("_createdate").toString();
			route.add(date);
			route.add(m.get("path"));
			route.add(m.get("id"));
			NameMap.put("route", route);
			routelist.add(NameMap);
		}
		Map Name = new HashMap();
		Name.put("routelist", routelist);
		JSONArray json2 = JSONArray.fromObject(Name);
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	 
	public void getQyinfo() {
		//获取企业信息
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		
		StringBuffer Sql = new  StringBuffer("");
		
		StringBuffer SqlNum = new  StringBuffer("");
		
		if (!StringUtils.isNotBlank(searchString)) {
			Sql.append(" SELECT * from t_qyxx_yqyd t  where 1=1  ") ;
			SqlNum.append(" SELECT count(t.id) from t_qyxx_yqyd t   where 1=1  ") ;
			if(StringUtils.isNotEmpty(_gsName)   ){
			   Sql.append( "and  t.dwmc like '%"+_gsName+"%'  ");
			   SqlNum.append( "and  t.dwmc like '%"+_gsName+"%'  ");
		   }
	 
			
		   if(StringUtils.isNotEmpty(_city)){
			   Sql.append( " and t.szd like '%"+_city+"%'   ");
			   SqlNum.append( " and t.szd like '%"+_city+"%'   ");
		   }
		   
		   if(StringUtils.isNotEmpty(_rodaName)){
			   Sql.append( " and t.xxdz like '%"+_rodaName+"%'   ");
			   SqlNum.append( " and t.xxdz like '%"+_rodaName+"%'   ");
		   }
		   
		   Sql.append(" order by t.id asc LIMIT "+pageNo*pageSize+","+pageSize+" ");
		}
		List res = this.mapService.getListBySql(Sql.toString());
		
		int totalPage = (int) Math.rint(this.mapService.countAll(SqlNum.toString())/pageSize);
		JSONArray json2 = JSONArray.fromObject(res);
		List reslist=new  ArrayList<>();
		reslist.add(totalPage);
		reslist.add(json2);
		try {
			response.getWriter().write(String.valueOf(reslist));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	

	// 查询巡逻路线@SteveChan
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void queryForXllxPath() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " SELECT * from t_xllx where id = '" + groupid + "'";
		}
		List res = this.mapService.getListBySql(Sql);
		Map m = (Map) res.get(0);
		String test = "[" + m.get("path") + "]";
		JSONArray json2 = JSONArray.fromObject(test);
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 删除巡逻路线 @SteveChan
	public void deleteForXllx() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " UPDATE t_xllx SET del_flag = '1' where id = '" + groupid + "'";
		}
		this.mapService.execute(Sql);
		try {
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 增加巡逻路线 @SteveChan
	public void addForxllx() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		Date date = new Date();// 获得系统时间.
		String currentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " INSERT into t_xllx (name,miaoshu,_creater,_createdate,path,del_flag) VALUES ('" + name + "','"
					+ miaoshu + "','" + creater + "','" + currentTime + "'," + LayerPath + ",'" + 0 + "') ";
		}
		this.mapService.execute(Sql);
		try {
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 查询感知图层
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void queryForGztc() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " SELECT * from (SELECT *  FROM t_gztc   ORDER BY create_date DESC)t  where  del_flag='0' limit "
					+ ((Integer.parseInt(currentpageNo) - 1) * Integer.parseInt(everyPages)) + "," + everyPages;
		}
		List res = this.mapService.getListBySql(Sql);
		List fencelist = new ArrayList();
		for (int i = 0; i < res.size(); i++) {
			Map m = (Map) res.get(i);
			if (!m.isEmpty()) {
				List fence = new ArrayList();
				Map NameMap = new HashMap();
				fence.add(m.get("name"));
				fence.add(m.get("miaoshu"));
				String date = "";
				try {
					date = m.get("create_date").toString();
				} catch (Exception e) {
					e.printStackTrace();
				}
				fence.add(date);
				fence.add(m.get("creater"));
				fence.add(m.get("point"));
				fence.add(m.get("polygon"));
				fence.add(m.get("id"));
				fence.add(m.get("distance"));
				fence.add(m.get("img"));
				NameMap.put("fence", fence);
				fencelist.add(NameMap);
			}
		}

		int count = this.mapService.countAll(" SELECT count(*) as  sum from t_gztc where  del_flag='0' ");
		Map rsMap = new HashMap();
		rsMap.put("totalPage", count);
		rsMap.put("currentpageNo", currentpageNo);
		rsMap.put("fencelist", fencelist);
		JSONArray json2 = JSONArray.fromObject(rsMap);
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 查询感知图层 按条件搜索
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void searchInfoOfgztc() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String sqls = "SELECT * from t_gztc t where ";
		String sumsql = "SELECT count(*) as  sum FROM t_gztc t  where ";
		String condition = " 1 = 1 ";
		if (GztcBeginDate != null && !"".equals(GztcBeginDate)) {
			condition = condition + " and create_date >= '" + GztcBeginDate + " 00:00:00'";
		}
		if (GztcEndDate != null && !"".equals(GztcEndDate)) {
			condition = condition + " and create_date <= '" + GztcEndDate + " 23:59:59'";
		}

		try {
			String Gztcnrs = URLDecoder.decode(Gztcnr, "UTF-8");
			if (!Gztcnrs.isEmpty()) {
				condition = condition + " and ( t.`name` like '%" + Gztcnrs + "%'  ||  t.`miaoshu` like '%" + Gztcnrs
						+ "%' )";
			}
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		condition = condition + " and t.del_flag = 0";

		int counts = this.mapService.countAll(sumsql + condition);// 求出合乎要求的条数
		condition = condition + " ORDER BY create_date DESC LIMIT "
				+ ((Integer.parseInt(currentpageNo) - 1) * Integer.parseInt(everyPages)) + "," + everyPages;
		List res = this.mapService.getListBySql(sqls + condition);
		List fencelist = new ArrayList();
		for (int i = 0; i < res.size(); i++) {
			Map m = (Map) res.get(i);
			if (!m.isEmpty()) {
				List fence = new ArrayList();
				Map NameMap = new HashMap();
				fence.add(m.get("name"));
				fence.add(m.get("miaoshu"));
				String date = "";
				try {
					date = m.get("create_date").toString();
				} catch (Exception e) {
					e.printStackTrace();
				}
				fence.add(date);
				fence.add(m.get("creater"));
				fence.add(m.get("point"));
				fence.add(m.get("polygon"));
				fence.add(m.get("id"));
				fence.add(m.get("distance"));
				fence.add(m.get("img"));
				NameMap.put("fence", fence);
				fencelist.add(NameMap);
			}
		}
		Map rsMap = new HashMap();
		rsMap.put("totalPage", counts);
		rsMap.put("currentpageNo", currentpageNo);
		rsMap.put("fencelist", fencelist);
		JSONArray json2 = JSONArray.fromObject(rsMap);
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			e.printStackTrace();
		}
	};

	// 查询警戒信息
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void queryForjjqy() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " SELECT t.*  FROM (SELECT *  FROM t_jjqy   ORDER BY end_date DESC) t where   t.del_flag = 0 limit "
					+ ((Integer.parseInt(currentpageNo) - 1) * Integer.parseInt(everyPages)) + "," + everyPages;
		}
		List res = this.mapService.getListBySql(Sql);

		String sqlOfsum = " SELECT count(*) as  sum FROM t_jjqy t  where t.del_flag = 0 ";
		int counts = this.mapService.countAll(sqlOfsum);

		Map rsMap = new HashMap();
		rsMap.put("totalPage", counts);
		rsMap.put("currentpageNo", currentpageNo);
		rsMap.put("res", res);
		JSONArray json2 = JSONArray.fromObject(rsMap);
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void queryForjjqy2ForSSwz() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " SELECT t.*  FROM t_jjqy t where   t.del_flag = 0 ";
		}
		List res = this.mapService.getListBySql(Sql);
		JSONArray json2 = JSONArray.fromObject(res);
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 查询一个感知要素
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void queryForGztcPath() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " SELECT * from t_gztc where id = '" + groupid + "'";
		}
		List res = this.mapService.getListBySql(Sql);
		Map m = new HashMap();
		String test = "";
		if (res.size() > 0) {
			m = (Map) res.get(0);
			test = "[" + m.get("path") + "]";
		}
		JSONArray json2 = JSONArray.fromObject(test);
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 增加感知要素
	public void addForGztc() throws IOException {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " INSERT into t_gztc (name,miaoshu,create_date,creater,point,del_flag,polygon,distance,img) VALUES ('"
					+ name + "','" + miaoshu + "','" + createrdate + "','" + creater + "',\"" + point + "\",'" + 0
					+ "',\"" + polygon + "\",'" + distance + "','" + img_url + "')";
		}
		try {
			this.mapService.execute(Sql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		List myId = this.mapService.getListBySql("SELECT max(id) as id from t_gztc");
		JSONArray json = JSONArray.fromObject(myId);
		try {
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 增加警戒区域
	public void addForjjqy() throws IOException {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " INSERT into t_jjqy (type,outLength,jjqy_otherText,jjqyName,inLength,end_date,beginDate,bufferOut,bufferOrigin,bufferIn,del_flag) VALUES ('"
					+ type + "','" + outLength + "','" + jjqy_otherText + "','" + jjqyName + "'," + inLength + ",'"
					+ end_date + "','" + beginDate + "',\"" + bufferOut + "\",\"" + bufferOrigin + "\",\"" + bufferIn
					+ "\"," + 0 + ") ";
		}

		try {
			this.mapService.execute(Sql);
		} catch (Exception e) {
			e.printStackTrace();
		}

		List myId = this.mapService.getListBySql("SELECT max(id) as id from t_jjqy");
		JSONArray json = JSONArray.fromObject(myId);
		try {
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 标记电子围栏的预警信息为已读
	public void deleteForYJ() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " UPDATE yjres SET isread = '1' where id = '" + groupid + "'";
		}
		this.mapService.execute(Sql);
		try {
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 标记警戒区域的预警信息为已读
	public void deleteForjjqyYJ() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " UPDATE t_jjqy_yj_info SET is_read = '1' where id = '" + groupid + "'";
		}
		try {
			this.mapService.execute(Sql);
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 删除警戒区域
	public void deleteForjjqy() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " UPDATE t_jjqy SET del_flag = '1' where id = '" + groupid + "'";
		}
		try {
			this.mapService.execute(Sql);
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 删除感知图层
	public void deleteForGztc() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " UPDATE t_gztc SET del_flag = '1' where id = '" + groupid + "'";
		}
		try {
			this.mapService.execute(Sql);
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 查询监控对象表
	public void queryForMonitor() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " SELECT * from t_monitor ";
		}
		List res = this.mapService.getListBySql(Sql);
		JSONArray json = JSONArray.fromObject(res);
		try {
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 开关感知图层
	public void toggleForGztc() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " UPDATE t_gztc SET typeid = '" + typeId + "' where id = '" + groupid + "'";
		}
		this.mapService.execute(Sql);
		try {
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 更新感知图层
	public void updateForGztc() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " UPDATE t_gztc SET  path = " + LayerPath + " where t_gztc.id=" + groupid;
		}
		try {
			this.mapService.execute(Sql);
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 查询电子围栏信息 by wxl
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void queryForDzwl() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " SELECT * from t_fence where del_flag = 0 order by id desc ";
		}
		List res = this.mapService.getListBySql(Sql);
		List fencelist = new ArrayList();
		for (int i = 0; i < res.size(); i++) {
			Map m = (Map) res.get(i);
			if (!m.isEmpty()) {
				List fence = new ArrayList();
				Map NameMap = new HashMap();
				fence.add(m.get("name"));
				fence.add(m.get("type"));
				String date = m.get("create_date").toString();
				fence.add(date);
				fence.add(m.get("creater"));
				fence.add(m.get("path"));
				fence.add(m.get("id"));
				fence.add(m.get("typeid"));
				NameMap.put("fence", fence);
				fencelist.add(NameMap);
			}
		}
		Map Name = new HashMap();
		Name.put("fencelist", fencelist);
		JSONArray json2 = JSONArray.fromObject(Name);
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 查询电子围栏@SteveChan
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void queryForDzwlPath() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " SELECT * from t_fence where id = '" + groupid + "'";
		}
		List res = this.mapService.getListBySql(Sql);
		Map m = (Map) res.get(0);
		String test = "[" + m.get("path") + "]";
		JSONArray json2 = JSONArray.fromObject(test);
		try {
			response.getWriter().write(String.valueOf(json2));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 增加电子围栏 @SteveChan
	public void addForDzwl() throws IOException {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		Date date = new Date();// 获得系统时间.
		String currentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " INSERT into t_fence (name,type,create_date,creater,path,del_flag,typeid) VALUES ('" + name + "','"
					+ miaoshu + "','" + currentTime + "','" + creater + "'," + LayerPath + ",'" + 0 + "','" + 0 + "') ";
		}
		this.mapService.execute(Sql);
		String exectMaxId = "SELECT max(id) as id from t_fence";
		List myId = this.mapService.getListBySql(exectMaxId);
		JSONArray json = JSONArray.fromObject(myId);
		try {
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 删除电子围栏 @SteveChan
	public void deleteForDzwl() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " UPDATE t_fence SET del_flag = '1' where id = '" + groupid + "'";
		}
		this.mapService.execute(Sql);
		try {
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 开关电子围栏 @SteveChan
	public void toggleForDzwl() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " UPDATE t_fence SET typeid = '" + typeId + "' where id = '" + groupid + "'";
		}
		this.mapService.execute(Sql);
		try {
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 更新电子围栏@SteveChan
	public void updateForDzwl() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " UPDATE t_fence SET  path = " + LayerPath + " where t_fence.id=" + groupid;
		}
		this.mapService.execute(Sql);
		try {
			response.getWriter().write("true");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 查询更多警戒区信息
	public void getMoreInfoOfjjqy() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String Sql = "SELECT * FROM (SELECT t.id, t2.jjqyName ,t2.beginDate,t2.end_date,t2.inLength,t2.outLength,t2.type,t2.id as jjqyid ,t2.del_flag,t3.bdlat,t3.bdlon,t3.`name` as yonghu,t3.user_name,t.timestemp as yjsj ,t.jjqy_type  from (SELECT * FROM  t_jjqy_yj_info s ORDER BY s.timestemp desc  LIMIT "
				+ this.yyqy_pageNO * 20 + "," + 20
				+ ") t join t_jjqy t2  on t.jjqy_id=t2.id join t_location t3 on t.wz_seq_no=t3.seq_no  where t.is_read=0  ) l  ORDER BY  l.yjsj ASC ";
		List myInfo = this.mapService.getListBySql(Sql);
		JSONArray json = JSONArray.fromObject(myInfo);
		try {
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 查询通知公告
	public void queryTzgg() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		try {
			tpb = tzggService.findAllTzgg(pageNo, pageSize);
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray json1 = JSONArray.fromObject(tpb);

		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	// 添加通知公告
	public void addtzgg() {
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		response.setCharacterEncoding("utf-8");
		String tzgg_title = request.getParameter("tzgg_title");
		String tzgg_context = request.getParameter("tzgg_context");
		String orl_content = tzgg_context;
		/*
		 * if (tzgg_context.contains("/res/images/")) { tzgg_context =
		 * tzgg_context.replace("/res/images/", "/res/images/"); }
		 */
		if (orl_content.contains("/res/images/")) {
			if (orl_content.contains(uploadUrls)) {
				orl_content = orl_content.replace(uploadUrls, "");
			}
			orl_content = orl_content.replace("/res/images/", uploadUrls + "/res/images/");
		}
		String stringpics = "";
		Set<String> pics = new HashSet<>();
		String img = "";
		Pattern p_image;
		Matcher m_image;
		String regEx_img = "<img.*src\\s*=\\s*(.*?)[^>]*?>";
		p_image = Pattern.compile(regEx_img, Pattern.CASE_INSENSITIVE);
		m_image = p_image.matcher(tzgg_context);
		while (m_image.find()) {
			// 得到<img />数据
			img = m_image.group();
			// 匹配<img>中的src数据
			Matcher m = Pattern.compile("src\\s*=\\s*\"?(.*?)(\"|>|\\s+)").matcher(img);
			while (m.find()) {
				pics.add("\"" + m.group(1) + "\"");
			}
		}
		if (pics.size() > 0) {
			stringpics = pics.toString();
		}
		tzgg_context = tzgg_context.replaceAll("<img[^>]*>", " ");
		String username = request.getParameter("username");
		Date date = new Date();// 获得系统时间.
		String nowTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
		String Sql = "";

		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " INSERT into t_notice (title,content,orl_content,author,create_time,update_time,deleted,pics) VALUES ('"
					+ tzgg_title + "','" + tzgg_context + "','" + orl_content + "','" + username + "','" + nowTime
					+ "','" + nowTime + "','0','" + stringpics + "')";
		}
		this.mapService.execute(Sql);
		String sqls = "select * from t_notice where create_time = '" + nowTime + "'";
		List tzgglist = this.mapService.getListBySql(sqls);
		JSONObject jsObject = new JSONObject();
		jsObject.put("type", 0);
		JSONArray jsonlist = JSONArray.fromObject(tzgglist);
		jsObject.put("data", jsonlist);
		try {
			this.appJmsSendTempl.send(new TextMessageCreator(jsObject.toString()));
			response.getWriter().write("true");
		} catch (Exception e) {
			this.mapService.execute("delete from t_notice where create_time = '" + nowTime + "'");
			e.printStackTrace();
		}
	}

	public void sendLbs() {
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		response.setCharacterEncoding("utf-8");
		String level = request.getParameter("level");
		JSONObject jsObject = new JSONObject();
		JSONObject data = new JSONObject();
		data.put("operate", "setSampleRate");
		data.put("value", level + "000");
		jsObject.put("type", 1);
		jsObject.put("data", data);
		try {
			this.appJmsSendTempl.send(new TextMessageCreator(jsObject.toString()));
			this.mapService.execute("update t_lbs set lbs ='" + level + "' where id ='1' ");
			response.getWriter().write("true");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// 添加layui图片
	public void addimg() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String realpath = ServletActionContext.getServletContext().getRealPath("/res/images");
		String pathfile = realpath.substring(0, realpath.indexOf("webapps") + 8) + "res/images";
		JSONObject result = new JSONObject();
		result.put("code", Integer.valueOf(-1));
		String uuid = UUID.randomUUID().toString();
		String prefix = this.fileFileName.substring(this.fileFileName.lastIndexOf(".") + 1);
		if (null != this.file) {
			File saveFile = new File(new File(pathfile), uuid + "." + prefix);
			if (!saveFile.getParentFile().exists()) {
				saveFile.getParentFile().mkdirs();
			}
			try {
				org.apache.commons.io.FileUtils.copyFile(this.file, saveFile);
				File file = new File(pathfile + "/thumb_" + uuid + "." + prefix);
				if (!file.exists()) {
					Thumbnails.of(saveFile.toString()).forceSize(140, 105).toFile(file.toString());
					// ImageUtil imgUtil = new ImageUtil();
					// imgUtil.thumbnailImage(saveFile.toString(), 140, 105);//
					// 生成缩略图
				}
				result.put("code", Integer.valueOf(0));
				JSONObject data = new JSONObject();
				data.put("src", "/res/images/thumb_" + uuid + "." + prefix);
				result.put("data", data);
			} catch (Exception ex) {
				result.put("code", Integer.valueOf(-1));
				result.put("msg", ex.getMessage());
			}
		}
		// AjaxUtil.ajaxJSONResponse(result);
		try {
			response.getWriter().write(result.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// 删除通知公告
	public void deltzgg() {
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		response.setCharacterEncoding("utf-8");
		String idArray = request.getParameter("idArray");
		Date date = new Date();// 获得系统时间.
		String nowTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
		String Sql = "";
		if (!StringUtils.isNotBlank(searchString)) {
			Sql = " update t_notice set deleted='1' , delete_time = '" + nowTime + "' where id in (" + idArray + ") ";
		}
		this.mapService.execute(Sql);
		try {
			response.getWriter().write("true");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// 查询信息上报未处理条数
	public void queryTotalxxsb() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		int total = 0;
		total = this.mapService.countAll(" select COUNT(*) FROM t_data_collect t where t.isupdate = 0 ");

		try {
			response.getWriter().write(String.valueOf(total));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// -------------------------------------------------------
	public List<Message> getMessageList() {
		return messageList;
	}

	public void setMessageList(List<Message> messageList) {
		this.messageList = messageList;
	}

	public List<Message> getContextList() {
		return contextList;
	}

	public void setContextList(List<Message> contextList) {
		this.contextList = contextList;
	}

	public PageBean<HistoryMsgPo> getPb() {
		return pb;
	}

	public void setPb(PageBean<HistoryMsgPo> pb) {
		this.pb = pb;
	}

	public PageBean<Message> getMpb() {
		return mpb;
	}

	public void setMpb(PageBean<Message> mpb) {
		this.mpb = mpb;
	}

	public PageBean<Tzgg> getTpb() {
		return tpb;
	}

	public void setTpb(PageBean<Tzgg> tpb) {
		this.tpb = tpb;
	}

	// 图片，视频下载解密、语音下载解密修改后缀名 by Lzr
	// public void yyPlayer() throws IOException {
	//
	// TrustManager[] tm = null;
	// SSLContext sslContext = null;
	// try {
	// // 创建SSLContext对象，并使用我们指定的信任管理器初始化
	// tm = new TrustManager[]{new MyX509TrustManager()};
	// sslContext = SSLContext.getInstance("SSL", "SunJSSE");
	// sslContext.init(null, tm, new java.security.SecureRandom());
	// } catch (KeyManagementException e) {
	// e.printStackTrace();
	// } catch (NoSuchAlgorithmException e) {
	// e.printStackTrace();
	// } catch (NoSuchProviderException e) {
	// e.printStackTrace();
	// } catch (Exception e) {
	// e.printStackTrace();
	// }
	//
	// // 从上述SSLContext对象中得到SSLSocketFactory对象
	// SSLSocketFactory ssf = sslContext.getSocketFactory();
	// // 创建URL对象
	//
	//
	// HttpServletRequest request = ServletActionContext.getRequest();
	// String yy_url = request.getParameter("yy_url");
	// String ypid = request.getParameter("ypid");//判断视频
	// URL url = new URL(yy_url);
	//
	//
	//
	//// HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
	//// conn.setSSLSocketFactory(ssf);
	// HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
	// conn.setHostnameVerifier(new HostnameVerifier()
	// {
	// public boolean verify(String hostname, SSLSession session)
	// {
	// return ProxyClientListener.REMOTE_HOST.equals(hostname);
	// }
	// });
	//
	//
	//// HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	// conn.setRequestProperty("Access-Token",
	// SessionUtil.getSessionUserToken());
	// //设置超时间为3秒
	// conn.setConnectTimeout(3 * 1000);
	// //防止屏蔽程序抓取而返回403错误
	// conn.setRequestProperty("User-Agent", "Mozilla/4.0 (compatible; MSIE 5.0;
	// Windows NT; DigExt)");
	// //得到输入流
	// InputStream inputStream = conn.getInputStream();
	// //获取自己数组
	// byte[] getData = readInputStream(inputStream);
	// String filename = url.getFile();
	// filename = filename.substring(filename.lastIndexOf('/') + 1);
	// String realPath =
	// request.getSession().getServletContext().getRealPath("/");
	// //String t = realPath.substring(0, realPath.indexOf("webapps") + 8);
	// //文件保存位置
	// File saveDir = new File(realPath + "/yyplayers");
	// if (!saveDir.exists()) {
	// saveDir.mkdir();
	// }
	// int tmp = filename.lastIndexOf('.');
	// //获取文件名，不含有文件后缀名
	// String name = "";
	// if ((tmp > -1) && (tmp < (filename.length()))) {
	// name = filename.substring(0, tmp);
	// }
	// File file, filesc;
	// if (filename.contains("jpg")) {
	// file = new File(saveDir + File.separator + name + "tp.jpg");
	// filesc = new File(saveDir + File.separator + name + ".jpg");//文件输出路径
	// } else {
	// if (ypid != null && !"".equals(ypid)) {
	// file = new File(saveDir + File.separator + name + "yp.tmp");
	// filesc = new File(saveDir + File.separator + name + ".tmp");//文件输出路径
	// } else {
	// file = new File(saveDir + File.separator + name + ".tmp");
	// filesc = new File(saveDir + File.separator + name + ".amr");//文件输出路径
	// }
	// }
	//
	// FileOutputStream fos = new FileOutputStream(file);
	// fos.write(getData);
	// if (fos != null) {
	// fos.close();
	// }
	// if (inputStream != null) {
	// inputStream.close();
	// }
	// EncryptUtils.decryptFile(file.toString(), filesc.toString(),
	// "mlight");//文件解密
	// HttpServletResponse response = ServletActionContext.getResponse();
	// response.setCharacterEncoding("utf-8");
	// try {
	// if (filename.contains("jpg")) {
	// response.getWriter().write("./yyplayers/" + name + ".jpg");//图片路径
	// } else {
	// if (ypid != null && !"".equals(ypid)) {
	// response.getWriter().write("../yyplayers/" + name + ".tmp");//视频路径
	// } else {
	// response.getWriter().write("./yyplayers/" + name + ".amr");//语音路径
	// }
	// }
	// } catch (IOException e) {
	// e.printStackTrace();
	// }
	// }

	/**
	 * 从输入流中获取字节数组
	 *
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	public static byte[] readInputStream(InputStream inputStream) throws IOException {
		byte[] buffer = new byte[1024];
		int len = 0;
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		while ((len = inputStream.read(buffer)) != -1) {
			bos.write(buffer, 0, len);
		}
		bos.close();
		return bos.toByteArray();
	}

	// 语音接收文件
	public void Recorder_file() throws FileNotFoundException, EncoderException {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		File audio = this.getFile();
		String Recorder_fileName = this.getMyFileName();
		FileInputStream fin = new FileInputStream(audio);
		OutputStream os = null;
		String allFile = null;
		String path = null;
		try {
			path = this.getFileFileURL();
			String realpath = ServletActionContext.getServletContext().getRealPath(path) + File.separator;// 获取服务器路径
			// 2、保存到临时文件
			// 1K的数据缓冲
			byte[] bs = new byte[1024];
			// 读取到的数据长度
			int len;
			// 输出的文件流保存到本地文件
			File tempFile = new File(realpath);
			if (!tempFile.exists()) {
				tempFile.mkdirs();
			}
			allFile = tempFile.getPath() + File.separator;
			// 生成的amr文件
			os = new FileOutputStream(allFile + Recorder_fileName);
			// 开始读取
			while ((len = fin.read(bs)) != -1) {
				os.write(bs, 0, len);
			}
			os.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// 完毕，关闭所有链接
			try {
				os.close();
				fin.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		// 转换 wav to amr
		String fromUrl = allFile + Recorder_fileName;
		String toUrl = allFile + Recorder_fileName.substring(0, Recorder_fileName.length() - 3) + "amr";

		String respTxt = "";
		try {
			transUtils.wav2amr(fromUrl, toUrl);
		} catch (IllegalArgumentException e1) {
			e1.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		/**
		 * 将文件上传到upload
		 */
		try {
			PrintWriter writer = response.getWriter();
			respTxt = uploadBridge.uploadUnencryptVoice(new File(toUrl));
			writer.write(respTxt);
			writer.flush();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 图片，视频下载解密、语音下载解密修改后缀名 by Lzr
	public void yyPlayer() throws IOException {

		// 创建URL对象
		HttpServletRequest request = ServletActionContext.getRequest();

		User user = SessionUtil.getUser(request.getSession());
		if (null == user) {
			return;
		}
		String yy_url = request.getParameter("yy_url");
		String ypid = request.getParameter("ypid");// 判断视频

		int _index = yy_url.indexOf("/M00/");

		String path = fdfsUrl + yy_url.substring(_index + 4, yy_url.length());
		File down_file = new File(path);
		// 得到输入流
		InputStream inputStream = new FileInputStream(down_file);
		// 获取自己数组
		byte[] getData = readInputStream(inputStream);
		String filename = down_file.getName();

		filename = filename.substring(filename.lastIndexOf('/') + 1);
		String filetype = filename.substring(filename.lastIndexOf(".") + 1);
		String realPath = request.getSession().getServletContext().getRealPath("/");

		// 文件保存位置
		File saveDir = new File(realPath + "/yyplayers");
		if (!saveDir.exists()) {
			saveDir.mkdir();
		}

		int tmp = filename.lastIndexOf('.');
		// 获取文件名，不含有文件后缀名
		String name = "";
		if ((tmp > -1) && (tmp < (filename.length()))) {
			name = filename.substring(0, tmp);
		}
		File file, filesc;
		List<String> filetypeList = new ArrayList<String>();
		filetypeList.add("jpg");
		filetypeList.add("jpeg");
		filetypeList.add("png");
		filetypeList.add("gif");
		filetypeList.add("bmp");
		if (filetypeList.indexOf(filetype) > -1) {
			file = new File(saveDir + File.separator + name + "tp." + filetype);
			filesc = new File(saveDir + File.separator + name + "." + filetype);// 文件输出路径
		} else {
			if (ypid != null && !"".equals(ypid)) {
				file = new File(saveDir + File.separator + name + "yp.tmp");
				filesc = new File(saveDir + File.separator + name + ".mp4");// 文件输出路径
			} else {

				if ("amr".equals(filetype)) {
					file = new File(saveDir + File.separator + name + ".amr");
					filesc = new File(saveDir + File.separator + name + "y.amr");
				} else {
					file = new File(saveDir + File.separator + name + ".tmp");
					filesc = new File(saveDir + File.separator + name + ".amr");// 文件输出路径
				}
			}
		}

		FileOutputStream fos = new FileOutputStream(file);
		fos.write(getData);
		if (fos != null) {
			fos.close();
		}
		if (inputStream != null) {
			inputStream.close();
		}
		EncryptUtils.decryptFile(file.toString(), filesc.toString(), key);// 文件解密
		String jmfile = filesc.toString();
		String jmfiletype = jmfile.substring(jmfile.lastIndexOf(".") + 1);
		if (jmfiletype.contains("amr")) {
			File filemp = new File(saveDir + File.separator + name + ".mp3");
			File source = new File(jmfile);
			File target = new File(filemp.toString());

			FFMpegUtil util = new FFMpegUtil(this.ffmpeg, jmfile);
			util.convertAudio(filemp.toString());

		}
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		try {
			if (filetypeList.indexOf(filetype) > -1) {
				response.getWriter().write("./yyplayers/" + name + "." + filetype);// 图片路径
			} else {
				if (ypid != null && !"".equals(ypid)) {
					response.getWriter().write("../yyplayers/" + name + ".mp4");// 视频路径
				} else {
					response.getWriter().write("./yyplayers/" + name + ".mp3");// 语音路径
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void sendSession() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		try {
			response.getWriter().write("A");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void lyPlayer() throws IOException {
		// 创建URL对象
		HttpServletRequest request = ServletActionContext.getRequest();

		User user = SessionUtil.getUser(request.getSession());
		if (null == user) {
			return;
		}
		String yy_url = request.getParameter("yy_url");
		int _index = yy_url.indexOf("/M00/");
		String path = fdfsUrl + yy_url.substring(_index + 4, yy_url.length());
		File down_file = new File(path);
		// 得到输入流
		InputStream inputStream = new FileInputStream(down_file);
		// 获取自己数组
		byte[] getData = readInputStream(inputStream);
		String filename = down_file.getName();

		filename = filename.substring(filename.lastIndexOf('/') + 1);
		// String filetype = filename.substring(filename.lastIndexOf(".") + 1);
		String realPath = request.getSession().getServletContext().getRealPath("/");

		// 文件保存位置
		File saveDir = new File(realPath + "/yyplayers");
		if (!saveDir.exists()) {
			saveDir.mkdir();
		}

		int tmp = filename.lastIndexOf('.');
		// 获取文件名，不含有文件后缀名
		String name = "";
		if ((tmp > -1) && (tmp < (filename.length()))) {
			name = filename.substring(0, tmp);
		}
		File file;

		file = new File(saveDir + File.separator + name + ".amr");
		FileOutputStream fos = new FileOutputStream(file);
		fos.write(getData);
		if (fos != null) {
			fos.close();
		}
		if (inputStream != null) {
			inputStream.close();
		}

		String jmfile = file.toString();
		String jmfiletype = jmfile.substring(jmfile.lastIndexOf(".") + 1);
		if (jmfiletype.contains("amr")) {
			FFMpegUtil util = new FFMpegUtil(ffmpeg, jmfile);
			util.convertAudio(saveDir + File.separator + name + ".mp3");
		}

		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		try {
			PrintWriter writer = response.getWriter();
			writer.write("./yyplayers/" + name + ".mp3");// 语音路径
			writer.flush();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 二维码生成@lzr
	public void QR_Create() {
		String path = this.getClass().getClassLoader().getResource("").getPath(); // 获取该类所在的路径
		String pathfile = path.substring(0, path.indexOf("webapps") + 8) + "update";
		File saveDir = new File(pathfile);
		if (!saveDir.exists()) {
			saveDir.mkdir();
		}
		String logoPath = path.substring(0, path.indexOf("WEB-INF")) + "images/gk.png";
		Create_QR.getLogoQRCode(appUrl, "跟控指挥", pathfile, logoPath);
	}

	/**
	 * 警戒区域计算
	 */
	public void queryYjInfo() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		// 获取当前的所有位置点信息
		String Sql = "  SELECT t.id, t2.jjqyName ,t2.beginDate,t2.end_date,t2.inLength,t2.outLength,t2.type,t2.id as jjqyid ,t2.del_flag,t3.bdlat,t3.bdlon,t3.`name` as yonghu,t3.user_name,t.timestemp as yjsj ,t.jjqy_type  from (SELECT * FROM  t_jjqy_yj_info s  where is_read=0  ORDER BY s.id desc   LIMIT 0,50) t join t_jjqy t2  on t.jjqy_id=t2.id join t_location t3 on t.wz_seq_no=t3.seq_no  ORDER BY t.id ";
		try {
			List res = mapService.getListBySql(Sql);
			JSONArray resJson = JSONArray.fromObject(res);
			PrintWriter writer = response.getWriter();
			if (resJson.size() > 0) {
				writer.write(resJson.toString());
			} else {
				writer.write(new JsonArray().toString());
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
	}

	/*
	 * 查询admin密码
	 */
	public void queryadminpassword() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		List userword = this.mapService.getListBySql("select * from t_user where username='admin'");
		String word = (String) ((Map) userword.get(0)).get("password");
		try {
			PrintWriter writer = response.getWriter();
			writer.write(word);
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	/**
	 * 查询lbs参数
	 */
	public void querylbs() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		List lbs = this.mapService.getListBySql("select * from t_lbs where id='1'");
		String s_lbs = (String) ((Map) lbs.get(0)).get("lbs");
		try {
			PrintWriter writer = response.getWriter();
			writer.write(s_lbs);
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	/**
	 * 用于获得当前服务器端时间
	 * 
	 * @author DDL007
	 */
	public void now() {
		long time = System.currentTimeMillis();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		try {
			PrintWriter writer = response.getWriter();
			writer.write(String.valueOf(time));// 语音路径
			writer.flush();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getLayerPath() {
		return LayerPath;
	}

	public String getPolygon() {
		return polygon;
	}

	public void setPolygon(String polygon) {
		this.polygon = polygon;
	}

	public void setLayerPath(String layerPath) {
		LayerPath = layerPath;
	}

	public String getCurrentpageNo() {
		return currentpageNo;
	}

	public void setCurrentpageNo(String currentpageNo) {
		this.currentpageNo = currentpageNo;
	}

	public String getEveryPages() {
		return everyPages;
	}

	public void setEveryPages(String everyPages) {
		this.everyPages = everyPages;
	}
}