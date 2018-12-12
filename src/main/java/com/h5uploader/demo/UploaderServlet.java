package com.h5uploader.demo;

import com.mlight.chat.util.IPUtil;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * 该Servlet用于任务指派时的文件上传<br/>
 * 不可用于消息中的附件上传
 */
public class UploaderServlet extends HttpServlet {
	@Override
	public void doOptions(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		if (IPUtil.isInnerIP(req.getRemoteHost())) {
			// 指定允许其他域名访问
			res.setHeader("Access-Control-Allow-Origin", "*");
			// 响应类型
			res.setHeader("Access-Control-Allow-Methods", "POST,GET");
			// 响应头设置
			res.setHeader("Access-Control-Allow-Headers", "x-requested-with,content-type");
		}
	}

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException {
		this.doOptions(req, res);
		res.setContentType("text/plain");
		res.setCharacterEncoding("UTF-8");
		DiskFileItemFactory diskFactory = new DiskFileItemFactory();
		PrintWriter pw = res.getWriter();
		// threshold 极限、临界值，即硬盘缓存 1M
		diskFactory.setSizeThreshold(4 * 1024);
		// repository 贮藏室，即临时文件目录
		diskFactory.setRepository(new File("D:/tmp"));
		String realPath = "D:/files";
		ServletFileUpload upload = new ServletFileUpload(diskFactory);
		upload.setFileSizeMax(1000 * 1000 * 1000);
		try {
			List<FileItem> list = upload.parseRequest(req);
			for (FileItem iter : list) {
				if (iter.isFormField()) {
				} else {
					this.processUploadFile(iter, pw, realPath);
				}
			}
		} catch (FileUploadException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void processUploadFile(FileItem item, PrintWriter pw, String path) throws Exception {
		// 此时的文件名包含了完整的路径，得注意加工一下
		String filename = item.getName();
		System.out.println("完整的文件名：" + filename);
		int index = filename.lastIndexOf("\\");
		filename = filename.substring(index + 1, filename.length());

		long fileSize = item.getSize();

		if ("".equals(filename) && fileSize == 0) {
			System.out.println("文件名为空 ...");
			return;
		}

		File uploadFile = new File(path + "/" + filename);
		item.write(uploadFile);
		pw.println(filename + " 文件保存完毕 ...");
		pw.println("文件大小为 ：" + fileSize + "\r\n");
	}
}
