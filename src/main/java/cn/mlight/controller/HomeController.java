package cn.mlight.controller;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import cn.mlight.utils.ImageUtil;
import net.sf.json.JSONObject;

/**
 * Created by lzr .
 */
@Controller
@RequestMapping("/home")
public class HomeController {
	@Value("#{settingProperties['encrypt.key']}")
	private String keys;
	@Value("#{settingProperties['uploadUrl']}")
	private String uploadUrl;

	@RequestMapping(value = "/addimg", produces = "application/json;charset=UTF-8")
	public void addimg(MultipartFile file, HttpSession session, HttpServletResponse response)
			throws IllegalStateException, IOException {
		if (file.getSize() > 0) {
			String filename = file.getOriginalFilename();
			String realpath = session.getServletContext().getRealPath("/res/images");
			String pathfile = realpath.substring(0, realpath.indexOf("webapps") + 8) + "res/images";
			JSONObject result = new JSONObject();
			result.put("code", Integer.valueOf(-1));
			String uuid = UUID.randomUUID().toString();
			String prefix = filename.substring(filename.lastIndexOf(".") + 1);
			if (null != file) {
				File saveFile = new File(new File(pathfile), uuid + "." + prefix);
				if (!saveFile.getParentFile().exists()) {
					saveFile.getParentFile().mkdirs();
				}
				file.transferTo(saveFile);
				try {
					File files = new File(pathfile + "/thumb_" + uuid + "." + prefix);
					if (!files.exists()) {
						// Thumbnails.of(saveFile.toString()).forceSize(140,
						// 105).toFile(files.toString());
						ImageUtil imgUtil = new ImageUtil();
						imgUtil.thumbnailImage(saveFile.toString(), 140, 105);//
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
			try {
				response.getWriter().write(result.toString());
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
	}
}
