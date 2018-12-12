package cn.mlight.controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.thrift.TException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mlight.chat.util.DateUtils;
import com.triman.tchat.model.DataCollect;
import com.triman.tchat.thrift.client.AdminClient;

import cn.mlight.utils.CheckUtils;
import cn.mlight.utils.EncryptUtils;
import cn.mlight.utils.Result;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import sun.misc.BASE64Encoder;

/**
 * Created by li wei on 2017/3/5.
 */
@SuppressWarnings("CallToPrintStackTrace")
@Controller
@RequestMapping("/sjcj")
public class SjcjController {
	@Value("#{settingProperties['encrypt.key']}")
	private String keys;
	@Value("#{settingProperties['uploadUrls']}")
	private String uploadUrls;
	@Value("#{settingProperties['fdfsUrl']}")
	private String fdfsUrl;
	@Autowired
	private AdminClient adminClient;

	@RequestMapping(value = "/findDataCollect", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String findDataCollect(String page_string, String size_string, String labelsid, String type_string,
			String timebegin_string, String timeend_string, String key, String creater, HttpServletRequest request)
					throws IOException {
		// String page_string = (String) session.getAttribute("page");
		String realPath = request.getSession().getServletContext().getRealPath("/");
		int page = 0;
		if (!CheckUtils.isEmpty(page_string)) {
			try {
				page = Integer.parseInt(page_string);
			} catch (java.lang.NumberFormatException e) {
				e.printStackTrace();
				page = 1;
			}
		}
		if (page == 0) {
			page = 1;
		}

		// String size_string = (String) session.getAttribute("size");
		int size = 0;
		if (!CheckUtils.isEmpty(size_string)) {
			try {
				size = Integer.parseInt(size_string);
			} catch (java.lang.NumberFormatException e) {
				e.printStackTrace();
				size = 20;
			}
		}
		if (size == 0) {
			size = 20;
		}

		// String labelsid = (String) session.getAttribute("labelsid");

		// String type_string = (String) session.getAttribute("type");
		int type = -1;
		if (!CheckUtils.isEmpty(type_string)) {
			try {
				type = Integer.parseInt(type_string);
			} catch (java.lang.NumberFormatException e) {
				e.printStackTrace();
				type = -1;
			}
		}
		DateUtils dUtils = new DateUtils();
		// String timebegin_string = (String) session.getAttribute("timebegin");
		long timebegin = 0L;

		if (!CheckUtils.isEmpty(timebegin_string)) {
			long tbegin_string = dUtils.getMilliseconds(timebegin_string, "yyyy-MM-dd HH:mm:ss");
			try {
				timebegin = tbegin_string;
			} catch (java.lang.NumberFormatException e) {
				e.printStackTrace();
				timebegin = 0L;
			}
		}

		long timeend = 0L;
		if (!CheckUtils.isEmpty(timeend_string)) {
			long tend_string = dUtils.getMilliseconds(timeend_string, "yyyy-MM-dd HH:mm:ss");
			try {
				timeend = tend_string;
			} catch (java.lang.NumberFormatException e) {
				e.printStackTrace();
				timeend = 0L;
			}
		}
		String result_string = "";
		try {
			result_string = adminClient.findDataCollect(page, size, labelsid, creater, type, timebegin, timeend, key);
		} catch (TException e) {
			e.printStackTrace();
		}
		JSONObject jsonObject = JSONObject.fromObject(result_string);
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		if (jsonObject.get("beanList") != null && !"".equals(jsonObject.get("beanList"))) {
			List beanList = (List) jsonObject.get("beanList");
			List res = new ArrayList<>();
			for (int i = 0; i < beanList.size(); i++) {
				Map xxsbmap = (Map) beanList.get(i);
				if (xxsbmap.containsKey("images") && xxsbmap.get("images") != null
						&& !"".equals(xxsbmap.get("images"))) {
					String imgxxsb = xxsbmap.get("images").toString();
					JSONArray imgArray = JSONArray.fromObject(imgxxsb);
					List imgres = new ArrayList<>();
					for (int x = 0; x < imgArray.size(); x++) {
						Map imgmap = (Map) imgArray.get(x);
						String thumbnil = imgmap.get("thumbnail").toString();
						String format = thumbnil.split("\\.")[1];
						String tppath = thumbnil.replace("M00", fdfsUrl);
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
							imgmap.put("thumbnail", dataUrl);
						}
						String original = uploadUrls + imgmap.get("original").toString();

						int _index = original.indexOf("/M00/");

						String path = fdfsUrl + original.substring(_index + 4, original.length());
						File down_file = new File(path);
						// 得到输入流
						InputStream inputStream = new FileInputStream(down_file);
						// 获取自己数组
						byte[] getData = readInputStream(inputStream);
						String filename = down_file.getName();

						filename = filename.substring(filename.lastIndexOf('/') + 1);
						String filetype = filename.substring(filename.lastIndexOf(".") + 1);
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
						File imgfile, filesc;
						imgfile = new File(saveDir + File.separator + name + "tp." + filetype);
						filesc = new File(saveDir + File.separator + name + "." + filetype);// 文件输出路径
						FileOutputStream fos = new FileOutputStream(imgfile);
						fos.write(getData);
						if (fos != null) {
							fos.close();
						}
						if (inputStream != null) {
							inputStream.close();
						}
						EncryptUtils.decryptFile(imgfile.toString(), filesc.toString(), keys);// 文件解密
						imgmap.put("original", "./yyplayers/" + name + "." + filetype);
						imgres.add(imgmap);
					}
					xxsbmap.put("images", imgres);
				} else if (xxsbmap.containsKey("video") && xxsbmap.get("video") != null
						&& !"".equals(xxsbmap.get("video"))) {
					String videoxxsb = xxsbmap.get("video").toString();
					JSONArray videoArray = JSONArray.fromObject(videoxxsb);
					List videores = new ArrayList<>();
					Map videomap = (Map) videoArray.get(0);
					String thumbnil = videomap.get("thumbnail").toString();
					String format = thumbnil.split("\\.")[1];
					String tppath = thumbnil.replace("M00", fdfsUrl);
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
						videomap.put("thumbnail", dataUrl);
					}
					String original = uploadUrls + videomap.get("original").toString();

					int _index = original.indexOf("/M00/");

					String path = fdfsUrl + original.substring(_index + 4, original.length());
					File down_file = new File(path);
					// 得到输入流
					InputStream inputStream = new FileInputStream(down_file);
					// 获取自己数组
					byte[] getData = readInputStream(inputStream);
					String filename = down_file.getName();

					filename = filename.substring(filename.lastIndexOf('/') + 1);
					String filetype = filename.substring(filename.lastIndexOf(".") + 1);
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
					File imgfile, filesc;
					imgfile = new File(saveDir + File.separator + name + "yp." + filetype);
					filesc = new File(saveDir + File.separator + name + "." + "mp4");// 文件输出路径
					FileOutputStream fos = new FileOutputStream(imgfile);
					fos.write(getData);
					if (fos != null) {
						fos.close();
					}
					if (inputStream != null) {
						inputStream.close();
					}
					EncryptUtils.decryptFile(imgfile.toString(), filesc.toString(), keys);// 文件解密
					videomap.put("original", "../yyplayers/" + name + ".mp4");
					videores.add(videomap);
					xxsbmap.put("video", videores);
				}
				res.add(xxsbmap);
			}
			jsonObject.put("beanList", res);
			// JSONArray jSArray = JSONArray.fromObject(res);
			return jsonObject.toString();
		} else {
			return jsonObject.toString();
		}
		// System.out.println(jsonArray);
	}

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

	@RequestMapping(value = "/updateDataCollect", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String updateDataCollect(String description, String labelsid, String xxsb_id, HttpServletRequest request) {
		// Result result = new Result();
		String result_string = "";
		DataCollect d = new DataCollect();
		d.setId(Long.parseLong(xxsb_id));
		d.setDescription(description);
		JSONObject json = JSONObject.fromObject(d);
		// boolean success = false;
		try {
			result_string = adminClient.updateDataCollect(json.toString(), labelsid);
			// success = true;
		} catch (TException e) {
			e.printStackTrace();
		}
		JSONObject jsonObject = JSONObject.fromObject(result_string);
		// result.setSuccess(success);
		// result.setMessage(result_string);
		return jsonObject.toString();
	}

	@RequestMapping(value = "/getLabel", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String getLabel(String page_string, String size_string, String creater, HttpServletRequest request) {
		// String page_string = (String) session.getAttribute("page");
		int page = 0;
		if (!CheckUtils.isEmpty(page_string)) {
			try {
				page = Integer.parseInt(page_string);
			} catch (java.lang.NumberFormatException e) {
				e.printStackTrace();
				page = 1;
			}
		}
		if (page == 0) {
			page = 1;
		}

		// String size_string = (String) session.getAttribute("size");
		int size = 0;
		if (!CheckUtils.isEmpty(size_string)) {
			try {
				size = Integer.parseInt(size_string);
			} catch (java.lang.NumberFormatException e) {
				e.printStackTrace();
				size = 20;
			}
		}
		if (size == 0) {
			size = 20;
		}

		// String creater = (String) session.getAttribute("creater");

		// Result result = new Result();
		String result_string = "";
		// boolean success = false;
		try {
			result_string = adminClient.getLabel(page, size, creater);
			// success = true;
		} catch (TException e) {
			e.printStackTrace();
		}
		JSONObject jsonObject = JSONObject.fromObject(result_string);
		return jsonObject.toString();
	}

	@RequestMapping(value = "/addLabel", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String addLabel(String label, String creater, HttpServletRequest request) {

		// String label = (String) session.getAttribute("label");
		// String creater = (String) session.getAttribute("creater");

		// Result result = new Result();
		// String result_string = "";
		// boolean success = false;
		String success = "";
		try {
			adminClient.addLabel(label, creater);
			success = "true";
		} catch (TException e) {
			e.printStackTrace();
		}
		return success;
	}

	@RequestMapping(value = "/deleteLabel", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public Result deleteLabel(HttpSession session) {

		String id = (String) session.getAttribute("id");

		Result result = new Result();
		String result_string = "";
		boolean success = false;
		try {
			success = adminClient.deleteLabel(id);
		} catch (TException e) {
			e.printStackTrace();
		}

		result.setSuccess(success);
		result.setMessage(result_string);
		return result;
	}
}
