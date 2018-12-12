package cn.mlight.controller;

import cn.mlight.utils.EncryptUtils;
import it.sauronsoftware.jave.AudioAttributes;
import it.sauronsoftware.jave.Encoder;
import it.sauronsoftware.jave.EncoderException;
import it.sauronsoftware.jave.EncodingAttributes;
import it.sauronsoftware.jave.InputFormatException;
import net.coobird.thumbnailator.Thumbnails;

import org.apache.struts2.ServletActionContext;
import org.csource.common.MyException;
import org.csource.fastdfs.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.BASE64Encoder;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.awt.image.BufferedImage;
import java.io.*;
import java.util.UUID;

@Controller
public class FileUploadController {

	@Value("#{settingProperties['ffmpeg.path']}")
	private String ffmpegPath;

	@Value("#{settingProperties['encrypt.key']}")
	private String key;

	@RequestMapping(value = "/sendimg", method = RequestMethod.POST)
	@ResponseBody
	public String sendimg(@RequestParam("dataType") String fileType, @RequestParam("file") MultipartFile multipartFile,
			HttpServletRequest request) throws IOException {
		String json;
		String fileId = "";
		String oldAddress = "";
		String newAddress = "";
		int smallWidth = 0;
		int smallHeight = 0;
		int bigWidth = 0;
		int bigHeight = 0;
		TrackerClient tracker = new TrackerClient();
		TrackerServer trackerServer = tracker.getConnection();
		String fileName = multipartFile.getOriginalFilename();
		String extName = fileName.substring(fileName.lastIndexOf(".") + 1);
		StorageClient1 client = new StorageClient1(trackerServer, null);
		File file = null;

		final InputStream is = multipartFile.getInputStream();

		// -------------------文件储存在临时库中start-------------------
		String realPath = request.getSession().getServletContext().getRealPath("/");
		// 文件保存位置
		File saveDir = new File(realPath + "/yyplayers");
		if (!saveDir.exists()) {
			saveDir.mkdir();
		}

		String _file_type = fileName.substring(fileName.lastIndexOf("."));
		String uuname = UUID.randomUUID().toString().replace("-", "").toUpperCase() + _file_type;
		String _temp_file_path = saveDir + File.separator + uuname;
		File _temp_file = new File(_temp_file_path);// 文件输出路径
		// 把文件保存在临时文件库中
		OutputStream os = new FileOutputStream(_temp_file);
		byte[] buffer = new byte[1024];
		int length = 0;
		while (-1 != (length = is.read(buffer, 0, buffer.length))) {
			os.write(buffer);
		}
		os.close();
		is.close();
		// -------------------文件储存在临时库中end-------------------

		// -------------------加密文件start-------------------
		String encryptFilePath = UUID.randomUUID().toString().replace("-", "").toUpperCase() + _file_type;
		File encryptFile = new File(saveDir + File.separator + encryptFilePath);
		EncryptUtils.encryptFile(_temp_file.toString(), encryptFile.toString(), key);
		// -------------------加密文件end-------------------

		/*-------------------上传加密文件start-------------------*/
		final InputStream encrypt_is = new FileInputStream(encryptFile);
		try {
			fileId = client.upload_file1("", encryptFile.length(), new UploadCallback() {
				@Override
				public int send(OutputStream out) throws IOException {
					int len;
					byte[] b = new byte[256];
					while ((len = encrypt_is.read(b)) != -1) {
						out.write(b, 0, len);
					}
					return 0;
				}
			}, extName, null);
			if (fileId.contains("/")) {
				oldAddress = fileId.substring(fileId.indexOf("/"));
			}
		} catch (MyException e) {
			e.printStackTrace();
		}
		/*-------------------上传加密文件end-------------------*/

		/*-------------------生成缩略图start-------------------*/
		InputStream thumbnail_is = null;
		String image_out = "";
		if ("image".equals(fileType)) {
			// 获得要压缩的宽度
			thumbnail_is = new FileInputStream(_temp_file);
			smallWidth = Integer.valueOf(request.getParameter("width"));
			BufferedImage originalImage = ImageIO.read(thumbnail_is);
			// 得到原图的宽和高
			bigWidth = originalImage.getWidth();
			bigHeight = originalImage.getHeight();
			// 计算应该把图像的高压缩到色像素
			smallHeight = bigHeight * smallWidth / bigWidth;
			BufferedImage thumbnail = Thumbnails.of(originalImage).size(smallWidth, smallHeight).asBufferedImage();

			String imageName = UUID.randomUUID().toString().replaceAll("-", "") + "." + extName;
			String filePath = realPath + "yyplayers\\" + imageName;
			file = new File(filePath);

			ImageIO.write(thumbnail, extName, file);

			BASE64Encoder encoder = new sun.misc.BASE64Encoder();
			try {
				FileInputStream inputStream = new FileInputStream(file);
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				byte[] b = new byte[1024];
				int len = 0;
				while ((len = inputStream.read(b)) != -1) {
					baos.write(b, 0, len);
				}

				byte[] bytes = baos.toByteArray();
				image_out = encoder.encodeBuffer(bytes).trim();
				if (null != image_out) {
					image_out = "data:image/" + extName + ";base64," + image_out;
				}
				inputStream.close();
				baos.close();
				baos.flush();

			} catch (Exception e) {
				e.printStackTrace();
			}

			try {
				fileId = client.upload_file1("", filePath, extName, null);
			} catch (MyException e) {
				e.printStackTrace();
			}

			if (fileId.contains("/")) {
				newAddress = fileId.substring(fileId.indexOf("/"));
			}

		}
		thumbnail_is.close();

		if (_temp_file.exists()) {
			_temp_file.delete();
		}

		if (file.exists()) {
			file.delete();
		}

		if (encryptFile.exists()) {
			encryptFile.delete();
		}

		String result = "{\"oldAddress\":\"" + oldAddress + "\",\"bigWidth\":" + bigWidth + ",\"bigHeight\":"
				+ bigHeight + ",\"newAddress\":\"" + newAddress + "\",\"smallWidth\":" + smallWidth
				+ ",\"smallHeight\":" + smallHeight + ",\"width\":" + request.getParameter("width") + ",\"height\":"
				+ request.getParameter("height") + ",\"dataType\":\"" + request.getParameter("dataType") + "\"}";
		//System.out.println(result);
		return result;
	}

	@RequestMapping(value = "update", method = RequestMethod.POST)
	public void update(HttpServletRequest request,HttpServletResponse response, @RequestParam(value = "file", required = false) MultipartFile file) {
		/**
		 * 1.简单上传文件并保存到headimg目录下
		 */
		String headImg = null;// 用户保存用户头像文件名
		if (file != null && !file.isEmpty()) {
			String uuid = UUID.randomUUID().toString().replaceAll("-", "");
			headImg = file.getOriginalFilename();
			String ty = file.getContentType();
			String filename = ty.substring(ty.lastIndexOf("/") + 1);
			// 构建上传目录及文件对象，不存在则自动创建
			String path = request.getSession().getServletContext().getRealPath("yyplayers");
			File imgFile = new File(path, uuid + headImg + "." + filename);
			String orl = path + "\\" + uuid + headImg + "." + filename;
			String tar = path + "\\" + uuid + headImg + ".amr";
			String tar_path = "yyplayers\\"+ uuid + headImg + ".amr";
			response.setCharacterEncoding("utf-8");
			// 保存文件
			try {
				file.transferTo(imgFile);
				boolean msg_ = wavtoamr(orl, tar);
				if (msg_) {
					response.getWriter().write(tar_path);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public static boolean wavtoamr(String orl, String tar) {
		boolean msg = false;
		File source = new File(orl);// 源文件地址

		File target = new File(tar);// 目前地址

		AudioAttributes audio = new AudioAttributes();

		audio.setCodec("libamr_nb");

		audio.setBitRate(new Integer(4750)); // 4750

		audio.setChannels(new Integer(1));

		audio.setSamplingRate(new Integer(8000));

		EncodingAttributes attrs = new EncodingAttributes();

		attrs.setFormat("amr");

		attrs.setAudioAttributes(audio);

		Encoder encoder = new Encoder();

		try {

			encoder.encode(source, target, attrs);
			msg = true;

		} catch (IllegalArgumentException e) {

			// TODO Auto-generated catch block

			e.printStackTrace();

		} catch (InputFormatException e) {

			// TODO Auto-generated catch block

			e.printStackTrace();

		} catch (EncoderException e) {

			// TODO Auto-generated catch block

			e.printStackTrace();

		}
		return msg;
	}
}