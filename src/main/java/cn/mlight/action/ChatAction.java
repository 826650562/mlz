package cn.mlight.action;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.springframework.beans.factory.annotation.Value;

import com.opensymphony.xwork2.ActionSupport;

import cn.mlight.domain.Group;
import cn.mlight.domain.LayFriend;
import cn.mlight.domain.LayGroup;
import cn.mlight.domain.LayUser;
import cn.mlight.domain.Message;
import cn.mlight.domain.User;
import cn.mlight.listener.SessionUtil;
import cn.mlight.service.ChatService;
import cn.mlight.service.MapService;
import cn.mlight.utils.CheckUtils;
import cn.mlight.utils.Constant;
import cn.mlight.utils.EncryptUtils;
import cn.mlight.utils.FFMpegUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import sun.misc.BASE64Encoder;

/**
 * @TODO 需要针对视图进行修改
 */
public class ChatAction extends ActionSupport {
	@Value("#{settingProperties['ffmpeg.path']}")
	private String ffmpeg;
	@Value("#{settingProperties['encrypt.key']}")
	private String key;
	@Value("#{settingProperties['fdfsUrl']}")
	private String fdfsUrl;
	@Resource
	private MapService mapService;
	@Resource
	private ChatService chatService;
	private List<Group> groupList;
	private List<Message> messageList;
	private List list;
	private List<User> userList;
	// top n
	private int queryCount;

	// 加载所有的个人，部门，讨论组
	private int id;
	// 获得当前收信人最近的N条消息
	private int top = 20;
	private int type;
	private String username;
	private int groupId;

	/**
	 * 定义新的参数 zlj 2017-05-13
	 */
	private List<LayFriend> layFriendList;
	private List<LayGroup> layGroupList;
	private String username_avater;

	/**
	 * 获得当前收信人最近的20条信息
	 */
	public void getNearestNMessage() {
		HttpSession session = ServletActionContext.getRequest().getSession();
		User admin = (User) session.getAttribute(Constant.USER_SESSION);
		messageList = chatService.getNearestNMessage(admin.getUsername(), username, top);
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		for (int i = 0; i < messageList.size(); i++) {
			String attachment = messageList.get(i).getAttachment();
			if (!"".equals(attachment) && attachment != null) {
				JSONObject jsonObject = JSONObject.fromObject(attachment);
				if (jsonObject.containsKey("thumbnail")) {
					String thumbnail = jsonObject.get("thumbnail").toString();
					String format = thumbnail.split("\\.")[1];
					String tppath = thumbnail.replace("M00", fdfsUrl);
					File file = new File(tppath);
					String dataUrl = null;
					if (file.exists()) {
						BufferedImage bi;
						try {
							bi = ImageIO.read(file);
							ByteArrayOutputStream baos = new ByteArrayOutputStream();
							ImageIO.write(bi, format, baos);
							byte[] bytes = baos.toByteArray();
							dataUrl = encoder.encodeBuffer(bytes).trim();
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					if (dataUrl != null) {
						dataUrl = "data:image/" + format + ";base64," + dataUrl;
						jsonObject.put("thumbnail", dataUrl);
					}
				}
				messageList.get(i).setAttachment(jsonObject.toString());
			}
		}
		JSONArray json = JSONArray.fromObject(messageList);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/json");
		response.setCharacterEncoding("utf-8");
		try {
			response.getWriter().write(json.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 群组信息的查询
	 */
	public void getNearestGMessage() {
		messageList = chatService.getNearestNMessage1(groupId, top);
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		for (int i = 0; i < messageList.size(); i++) {
			String attachment = messageList.get(i).getAttachment();
			if (!"".equals(attachment) && attachment != null) {
				JSONObject jsonObject = JSONObject.fromObject(attachment);
				if (jsonObject.containsKey("thumbnail")) {
					String thumbnail = jsonObject.get("thumbnail").toString();
					String format = thumbnail.split("\\.")[1];
					String tppath = thumbnail.replace("M00", fdfsUrl);
					File file = new File(tppath);
					String dataUrl = null;
					if (file.exists()) {
						BufferedImage bi;
						try {
							bi = ImageIO.read(file);
							ByteArrayOutputStream baos = new ByteArrayOutputStream();
							ImageIO.write(bi, format, baos);
							byte[] bytes = baos.toByteArray();
							dataUrl = encoder.encodeBuffer(bytes).trim();
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					if (dataUrl != null) {
						dataUrl = "data:image/" + format + ";base64," + dataUrl;
						jsonObject.put("thumbnail", dataUrl);
					}
				}
				messageList.get(i).setAttachment(jsonObject.toString());
			}
		}
		JSONArray json = JSONArray.fromObject(messageList);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/json");
		response.setCharacterEncoding("utf-8");
		// System.out.println(json);
		try {
			response.getWriter().write(json.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/*
	 * public void getAllUserOrGroup() { HttpSession session =
	 * ServletActionContext.getRequest().getSession(); User admin = (User)
	 * session.getAttribute(Constant.USER_SESSION); groupList =
	 * chatService.findAll(admin.getUsername()); userList =
	 * chatService.findByUser(); BASE64Encoder encoder = new
	 * sun.misc.BASE64Encoder(); for (int i = 0; i < userList.size(); i++) { if
	 * (!"".equals(userList.get(i).getAvatar()) && userList.get(i).getAvatar()
	 * != null) { String txpath = userList.get(i).getAvatar(); String format =
	 * txpath.split("\\.")[1]; String tppath = txpath.replace("M00",
	 * "data/fastdfs/data"); File file = new File(tppath); String dataUrl =
	 * null; if (file.exists()) { BufferedImage bi; try { bi =
	 * ImageIO.read(file); ByteArrayOutputStream baos = new
	 * ByteArrayOutputStream(); ImageIO.write(bi, format, baos); byte[] bytes =
	 * baos.toByteArray(); dataUrl = encoder.encodeBuffer(bytes).trim(); } catch
	 * (Exception e) { e.printStackTrace(); } } if (dataUrl != null) { dataUrl =
	 * "data:image/" + format + ";base64," + dataUrl; }
	 * userList.get(i).setAvatar(dataUrl); } } JSONArray json =
	 * JSONArray.fromObject(groupList); JSONArray json1 =
	 * JSONArray.fromObject(userList); HttpServletResponse response =
	 * ServletActionContext.getResponse(); response.setContentType("text/json");
	 * response.setCharacterEncoding("utf-8"); String jsons = "{\"qz\":" +
	 * json.toString() + ",\"gr\":" + json1.toString() + "}"; try {
	 * response.getWriter().write(jsons); } catch (IOException e) {
	 * e.printStackTrace(); } }
	 */

	/**
	 * 查询所有的用户、群组（包含user、department、group、group_member） mine: {} ,friend: []
	 * ,group: [] 2017-05-12 ZLJ
	 */
	public void getAllUserOrGroup() {
		HttpSession session = ServletActionContext.getRequest().getSession();
		// mine
		LayUser mine = new LayUser();
		User admin = (User) session.getAttribute(Constant.USER_SESSION);
		mine.setId(admin.getUsername());
		mine.setUsername(admin.getName());
		mine.setSign(" 欢 迎 您 ！");
		mine.setStatus("online");
		mine.setUid(admin.getId().toString());
		// friends
		layFriendList = this.getLayFriends(admin.getUsername());
		// groups
		layGroupList = this.getLayGroups();
		mine.setAvatar(username_avater);

		JSONObject json = JSONObject.fromObject(mine);
		JSONArray json1 = JSONArray.fromObject(layFriendList);
		JSONArray json2 = JSONArray.fromObject(layGroupList);

		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/json");
		response.setCharacterEncoding("utf-8");
		String jsons = "{\"code\":0,\"msg\": \"\",\"data\":{\"mine\": " + json.toString() + ",\"friend\":"
				+ json1.toString() + ",\"group\":" + json2.toString() + "} }";
		// System.out.println(jsons);
		try {
			response.getWriter().write(jsons);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 查询friends 2017-05-13 ZLJ
	 */
	public List<LayFriend> getLayFriends(String usrid) {
		List<LayFriend> List = new ArrayList<LayFriend>();
		try {
			// 查询部门list
			List<?> departmentList = chatService
					.getListBySql("select t.id,t.name  from t_department t  where t.deleted = 0 ");
			for (int i = 0; i < departmentList.size(); i++) {
				String depId = ((Map) departmentList.get(i)).get("ID") != null
						? ((Map) departmentList.get(i)).get("ID").toString() : "";
				String depName = ((Map) departmentList.get(i)).get("NAME") != null
						? ((Map) departmentList.get(i)).get("NAME").toString() : "";
				List<LayUser> layUserList = new ArrayList<LayUser>();
				// 根据部门id查询users
				List<?> userlListById = chatService.getListBySql(
						"SELECT a.id uid, a.username id ,a.name username ,a.avatar ,'' status,'' sign from t_user a  where a.deleted =0  and a.department_id = "
								+ depId);
				for (int j = 0; j < userlListById.size(); j++) {
					String id = ((Map) userlListById.get(j)).get("ID") != null
							? ((Map) userlListById.get(j)).get("ID").toString() : "";
					;
					String username = ((Map) userlListById.get(j)).get("USERNAME") != null
							? ((Map) userlListById.get(j)).get("USERNAME").toString() : "";
					;
					String status = ((Map) userlListById.get(j)).get("STATUS") != null
							? ((Map) userlListById.get(j)).get("STATUS").toString() : "";
					;
					String sign = ((Map) userlListById.get(j)).get("SIGN") != null
							? ((Map) userlListById.get(j)).get("SIGN").toString() : "";
					;
					String avatar = ((Map) userlListById.get(j)).get("AVATAR") != null
							? ((Map) userlListById.get(j)).get("AVATAR").toString() : "";

					String uid = ((Map) userlListById.get(j)).get("UID") != null
							? ((Map) userlListById.get(j)).get("UID").toString() : "";
					avatar = getHeadImg(avatar);
					// 建一个用户
					LayUser Users = new LayUser();
					Users.setId(id);
					Users.setUsername(username);
					// Users.setStatus(status); //online
					Users.setStatus("online"); // 临时
					Users.setSign(sign);
					Users.setAvatar(avatar);
					Users.setUid(uid);
					if (id.equals(usrid)) {
						username_avater = avatar;
					} else {
						// 插入到list中
						layUserList.add(Users);
					}

				}
				LayFriend layFriend = new LayFriend();
				layFriend.setId(depId);
				layFriend.setGroupname(depName);
				layFriend.setList(layUserList);
				List.add(layFriend);
			}
		} catch (Exception e) {
			System.out.println("获取用户列表失败！");
			e.printStackTrace();
		}
		return List;
	}

	/**
	 * 头像处理
	 */
	public String getHeadImg(String avatar) {
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		if (!"".equals(avatar) && avatar != null) {
			String format = avatar.split("\\.")[1];
			String spath = avatar.replace("M00", fdfsUrl);
			File file = new File(spath);
			String dataUrl = null;
			if (file.exists()) {
				BufferedImage bi;
				try {
					bi = ImageIO.read(file);
					ByteArrayOutputStream baos = new ByteArrayOutputStream();
					ImageIO.write(bi, format, baos);
					byte[] bytes = baos.toByteArray();
					dataUrl = encoder.encodeBuffer(bytes).trim();
				} catch (Exception e) {
					e.printStackTrace();
				}
				// file.delete();
			}
			if (dataUrl != null) {
				avatar = "data:image/" + format + ";base64," + dataUrl;
			}
		}
		if ("".equals(avatar) || avatar == "") {
			avatar = "mx/lsxx/images/tx1.png";
		}
		return avatar;
	}

	/**
	 * 获取特殊用户的详细信息
	 */
	public void getFriend() {
		String sql = "SELECT a.id uid, a.department_id did,a.username id ,a.name username ,a.avatar ,'' status,'' sign from t_user a where username='"
				+ username + "'";
		List user_list = this.mapService.getListBySql(sql);
		String id = ((Map) user_list.get(0)).get("ID") != null ? ((Map) user_list.get(0)).get("ID").toString() : "";
		;
		String did = ((Map) user_list.get(0)).get("did") != null ? ((Map) user_list.get(0)).get("did").toString() : "";
		;
		String username = ((Map) user_list.get(0)).get("USERNAME") != null
				? ((Map) user_list.get(0)).get("USERNAME").toString() : "";
		;
		String status = ((Map) user_list.get(0)).get("STATUS") != null
				? ((Map) user_list.get(0)).get("STATUS").toString() : "";
		;
		String sign = ((Map) user_list.get(0)).get("SIGN") != null ? ((Map) user_list.get(0)).get("SIGN").toString()
				: "";
		;
		String avatar = ((Map) user_list.get(0)).get("AVATAR") != null
				? ((Map) user_list.get(0)).get("AVATAR").toString() : "";
		String uid = ((Map) user_list.get(0)).get("UID") != null ? ((Map) user_list.get(0)).get("UID").toString() : "";
		avatar = getHeadImg(avatar);
		List groupName = this.mapService.getListBySql("select name from t_department where id='" + did + "'");
		String groupname = "默认分组";
		String groupid = "-1";
		if (groupName.size() > 0) {
			groupname = ((Map) user_list.get(0)).get("NAME") != null ? ((Map) user_list.get(0)).get("NAME").toString()
					: "";
			groupid = did;
		}
		// 建一个用户
		LayUser Users = new LayUser();
		Users.setId(id);
		Users.setUsername(username);
		// Users.setStatus(status); //online
		Users.setStatus("online"); // 临时
		Users.setSign(sign);
		Users.setAvatar(avatar);
		Users.setUid(uid);
		JSONObject jsonObject = JSONObject.fromObject(Users);
		jsonObject.put("groupname", groupname);
		jsonObject.put("groupid", groupid);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(jsonObject));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	/**
	 * 查询groups 2017-05-13 zlj
	 */
	public List<LayGroup> getLayGroups() {
		List<LayGroup> groupList = new ArrayList<LayGroup>();
		try {
			List<?> groList = chatService.getListBySql(
					" SELECT t.id, t.name groupname,t.logo avatar FROM t_group t where t.deleted = 0 and t.department_id = '-1' ORDER BY t.create_time ");
			for (int i = 0; i < groList.size(); i++) {
				String id = ((Map) groList.get(i)).get("ID") != null ? ((Map) groList.get(i)).get("ID").toString() : "";
				String groupname = ((Map) groList.get(i)).get("GROUPNAME") != null
						? ((Map) groList.get(i)).get("GROUPNAME").toString() : "";
				String avatar = ((Map) groList.get(i)).get("AVATAR") != null
						? ((Map) groList.get(i)).get("AVATAR").toString() : "";
				LayGroup group = new LayGroup();
				group.setId(id);
				group.setGroupname(groupname);
				// group.setAvatar(avatar);
				group.setAvatar("mx/lsxx/images/qztx1.png");
				groupList.add(group);
			}

		} catch (Exception e) {
			System.out.println("获取用户列表失败！");
			e.printStackTrace();
		}
		return groupList;
	}

	/**
	 * 查看组里的成员 zlj 2017-05-23
	 */
	public void getMembers() {
		List<?> memList = chatService.getListBySql(
				"select t.username id,a.name username,a.avatar ,'' sign,a.id uid from t_group_member t  join t_user a on  t.username = a.username where t.group_id = '"
						+ id + "' and t.deleted = '0' ");
		List<LayUser> layUserList = new ArrayList<LayUser>();
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		// 根据部门id查询users
		for (int j = 0; j < memList.size(); j++) {
			String id = ((Map) memList.get(j)).get("ID") != null ? ((Map) memList.get(j)).get("ID").toString() : "";
			;
			String username = ((Map) memList.get(j)).get("USERNAME") != null
					? ((Map) memList.get(j)).get("USERNAME").toString() : "";
			;
			// String status = ((Map) userlListById.get(j)).get("STATUS") !=
			// null ? ((Map) userlListById.get(j)).get("STATUS").toString() :
			// "";;
			String sign = ((Map) memList.get(j)).get("SIGN") != null ? ((Map) memList.get(j)).get("SIGN").toString()
					: "";
			;
			String avatar = ((Map) memList.get(j)).get("AVATAR") != null
					? ((Map) memList.get(j)).get("AVATAR").toString() : "";
			String uid = ((Map) memList.get(j)).get("UID") != null ? ((Map) memList.get(j)).get("UID").toString() : "";

			if ("".equals(avatar) || avatar == "") {
				avatar = "mx/lsxx/images/tx1.png";
			} else {
				String format = avatar.split("\\.")[1];
				String spath = avatar.replace("M00", fdfsUrl);
				File file = new File(spath);
				String dataUrl = null;
				if (file.exists()) {
					BufferedImage bi;
					try {
						bi = ImageIO.read(file);
						ByteArrayOutputStream baos = new ByteArrayOutputStream();
						ImageIO.write(bi, format, baos);
						byte[] bytes = baos.toByteArray();
						dataUrl = encoder.encodeBuffer(bytes).trim();
					} catch (Exception e) {
						e.printStackTrace();
					}
					// file.delete();
				}
				if (dataUrl != null) {
					avatar = "data:image/" + format + ";base64," + dataUrl;
				}
			}
			// 建一个用户
			LayUser Users = new LayUser();
			Users.setId(id);
			Users.setUsername(username);
			// Users.setStatus(status); //online
			Users.setStatus("online"); // 临时
			Users.setSign(sign);
			Users.setAvatar(avatar);
			Users.setUid(uid);

			// 插入到list中
			layUserList.add(Users);
		}
		JSONArray json = JSONArray.fromObject(layUserList);
		int numbers = memList.size();
		String jsons = "{\"code\":0,\"msg\": \"\",\"data\":{\"list\":" + json.toString() + "} }";
		// System.out.println(jsons);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/json");
		response.setCharacterEncoding("utf-8");
		try {
			response.getWriter().write(jsons);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 查看管理员与其他人的记录查询
	 * 
	 */
	public void getTopNContactUserOrGroup() {
		HttpSession session = ServletActionContext.getRequest().getSession();
		User admin = (User) session.getAttribute(Constant.USER_SESSION);
		List sessionList = chatService.getNearestNSession(admin.getUsername(), queryCount);

		JSONArray json = JSONArray.fromObject(sessionList);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/json");
		response.setCharacterEncoding("utf-8");
		try {
			response.getWriter().write(json.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	/**
	 * 获取后端数据的最近更新时间，目的在于比较手机端和服务器端的差异
	 */
	public void getMaxUpdateTime() {

	}

	// ----------------------
	public List<Group> getGroupList() {
		return groupList;
	}

	public void setGroupList(List<Group> groupList) {
		this.groupList = groupList;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Message> getMessageList() {
		return messageList;
	}

	public void setMessageList(List<Message> messageList) {
		this.messageList = messageList;
	}

	public List<User> getUserList() {
		return userList;
	}

	public void setUserList(List<User> userList) {
		this.userList = userList;
	}

	public int getQueryCount() {
		return queryCount;
	}

	public void setQueryCount(int queryCount) {
		this.queryCount = queryCount;
	}

	public List getList() {
		return list;
	}

	public void setList(List list) {
		this.list = list;
	}

	public int getTop() {
		return top;
	}

	public void setTop(int top) {
		this.top = top;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public int getGroupId() {
		return groupId;
	}

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

	public void encryptImage() throws IOException {
		// 创建URL对象
		HttpServletRequest request = ServletActionContext.getRequest();
		User user = SessionUtil.getUser(request.getSession());
		if (null == user) {
			return;
		}
		String image_path = request.getParameter("path");
		int _index = image_path.indexOf("/M00/");
		String image_type = image_path.substring(image_path.lastIndexOf(".") + 1);

		// 源文件，已经加密的图片
		String path = fdfsUrl + image_path.substring(_index + 4, image_path.length());
		File down_file = new File(path);

		// 临时文件文件保存位置
		String realPath = request.getSession().getServletContext().getRealPath("/");
		File _temp_path = new File(realPath + "/yyplayers");
		if (!_temp_path.exists()) {
			_temp_path.mkdir();
		}
		// 临时文件名称
		String encryptFileName = UUID.randomUUID().toString().replace("-", "").toUpperCase() + "." + image_type;
		// 临时文件路径
		String unencrypt_image_path = _temp_path + File.separator + encryptFileName;

		File encryptFile = new File(unencrypt_image_path);
		EncryptUtils.decryptFile(down_file.toString(), encryptFile.toString(), key);

		// 得到输入流
		InputStream inputStream = new FileInputStream(encryptFile);
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();

		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		byte[] b = new byte[1024];
		int len = 0;
		while ((len = inputStream.read(b)) != -1) {
			baos.write(b, 0, len);
		}
		byte[] bytes = baos.toByteArray();
		String image_out = encoder.encodeBuffer(bytes).trim();

		if (null != image_out) {
			image_out = "data:image/" + image_type + ";base64," + image_out;
		}

		// 关闭对象
		baos.close();
		inputStream.close();

		// 输出
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		PrintWriter pw = response.getWriter();
		pw.write(image_out);
		pw.close();
		if (_temp_path.exists()) {
			_temp_path.delete();
		}
	}

	public void unencryptImage() throws IOException {
		// 创建URL对象
		HttpServletRequest request = ServletActionContext.getRequest();
		User user = SessionUtil.getUser(request.getSession());
		if (null == user) {
			return;
		}
		String image_path = request.getParameter("path");

		int _index = image_path.indexOf("/M00/");

		String path = fdfsUrl + image_path.substring(_index + 4, image_path.length());
		File down_file = new File(path);
		String image_type = image_path.substring(image_path.lastIndexOf(".") + 1);
		// 得到输入流
		InputStream inputStream = new FileInputStream(down_file);
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();

		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		byte[] b = new byte[1024];
		int len = 0;
		while ((len = inputStream.read(b)) != -1) {
			baos.write(b, 0, len);
		}

		byte[] bytes = baos.toByteArray();
		String image_out = encoder.encodeBuffer(bytes).trim();
		if (null != image_out) {
			image_out = "data:image/" + image_type + ";base64," + image_out;
		}
		// 关闭对象
		baos.close();
		inputStream.close();

		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		PrintWriter pw = response.getWriter();
		pw.write(image_out);
		pw.close();
	}

	/**
	 * 图片消息类型 2017-05-15 zlj
	 */
	public void loadImage() throws IOException {
		// 创建URL对象
		HttpServletRequest request = ServletActionContext.getRequest();
		User user = SessionUtil.getUser(request.getSession());
		if (null == user) {
			return;
		}

		String file = request.getParameter("file");
		System.out.println("file");

		String imgStr = "http://localhost:8080/xxcj_zhd_mlight_1/upload/image/default.png";

		String image_out = "{\"code\":0,\"msg\":\"ok\",\"data\":{\"src\":\"" + imgStr + "\"}}";

		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		PrintWriter pw = response.getWriter();
		pw.write(image_out);
		pw.close();
	}

	// 个人信息@lzr
	public void queryPerson() {
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		response.setCharacterEncoding("utf-8");
		String sender = request.getParameter("sender");
		String receiver = request.getParameter("receiver");
		String endTime = request.getParameter("endTime");
		String pagesize = request.getParameter("pagesize");
		int size = 10;
		if (!CheckUtils.isEmpty(pagesize)) {
			size = Integer.parseInt(pagesize);
		}
		/*
		 * List personMsg = this.mapService .getListBySql(
		 * "select * from v_message_all where create_time < '2017-09-30 09:03:30' "
		 * +
		 * "and sender IN('admin','test1') AND receiver IN('admin','test1') and group_id='-1' "
		 * + "ORDER BY create_time DESC  LIMIT 10");
		 */

		List personMsg = this.mapService.getListBySql("select * from t_message where create_time < '" + endTime + "' "
				+ "and sender IN('" + sender + "','" + receiver + "') AND receiver IN('" + sender + "','" + receiver
				+ "')" + " and GROUP_ID = '-1'  ORDER BY create_time DESC LIMIT " + size + " ");

		List perList = Jx_List(personMsg);
		JSONArray jsonArray = JSONArray.fromObject(perList);
		try {
			response.getWriter().write(String.valueOf(jsonArray));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	// 群组信息@lzr
	public void queryGroup() {
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		response.setCharacterEncoding("utf-8");
		String groupid = request.getParameter("groupid");
		String endTime = request.getParameter("endTime");
		String pagesize = request.getParameter("pagesize");
		int size = 10;
		if (!CheckUtils.isEmpty(pagesize)) {
			size = Integer.parseInt(pagesize);
		}
		/*
		 * List GroupMsg = this.mapService .getListBySql(
		 * "SELECT * FROM v_message_all WHERE create_time < '2017-09-30 09:03:30'"
		 * +
		 * " and  group_id = ' 20 ' GROUP BY create_time ORDER BY create_time DESC  LIMIT 10"
		 * );
		 */

		List GroupMsg = this.mapService
				.getListBySql("SELECT * FROM t_message WHERE create_time < '" + endTime + "' and  group_id = '"
						+ groupid + "' " + "GROUP BY create_time ORDER BY create_time DESC  LIMIT " + size + "");

		List groupList = Jx_List(GroupMsg);
		JSONArray jsonArray = JSONArray.fromObject(groupList);
		try {
			response.getWriter().write(String.valueOf(jsonArray));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public List Jx_List(List List_Msg) {
		List msg_list = new ArrayList();
		for (int i = 0; i < List_Msg.size(); i++) {
			Map Msg_Map = (Map) List_Msg.get(i);
			String type = Msg_Map.get("type").toString();
			if ("1".equals(type) || "2".equals(type) || "3".equals(type)) {
				String attachment = (String) Msg_Map.get("attachment");
				JSONObject jsonObject = JSONObject.fromObject(attachment);
				if ("1".equals(type)) {
					String original = jsonObject.get("original").toString();
					try {
						original = yyPlayer(original, "1");
						jsonObject.put("original", original);
						Msg_Map.put("attachment", jsonObject);
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				} else {
					String url = jsonObject.get("url").toString();
					try {
						url = yyPlayer(url, "2");
						jsonObject.put("url", url);
						Msg_Map.put("attachment", jsonObject);
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
			msg_list.add(Msg_Map);
		}
		return msg_list;
	}

	// 图片，视频下载解密、语音下载解密修改后缀名 by Lzr
	public String yyPlayer(String yy_url, String ypid) throws IOException {

		// 创建URL对象
		HttpServletRequest request = ServletActionContext.getRequest();
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
			if ("1".equals(ypid)) {
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
		if (filetypeList.indexOf(filetype) > -1) {
			return "/yyplayers/" + name + "." + filetype;// 图片路径
		} else {
			if (ypid != null && !"".equals(ypid)) {
				return "/yyplayers/" + name + ".mp4";// 视频路径
			} else {
				return "/yyplayers/" + name + ".mp3";// 语音路径
			}
		}
	}

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

}
