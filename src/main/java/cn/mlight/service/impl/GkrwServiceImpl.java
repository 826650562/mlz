package cn.mlight.service.impl;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import cn.mlight.dao.GkrwDao;
import cn.mlight.dao.MapDao;
import cn.mlight.domain.Gkrw;
import cn.mlight.domain.Target;
import cn.mlight.service.GkrwService;
import cn.mlight.service.MapService;
import cn.mlight.utils.PageBean;
import net.sf.json.JSONObject;
import sun.misc.BASE64Encoder;

@Service("gkrwService")
public class GkrwServiceImpl implements GkrwService {
	@Value("#{settingProperties['fdfsUrl']}")
	private String fdfsUrl;
	@Resource
	private GkrwDao gkrwDao;

	@Resource
	private MapDao mapDao;

	@Resource
	private MapService mapService;

	@Override
	public Integer getCount(Gkrw ns) {
		// TODO Auto-generated method stub
		return gkrwDao.getCount(ns);
	}

	@Override
	public List<Gkrw> getAll(Gkrw ns, Integer pageNum, Integer pageCount) {
		// TODO Auto-generated method stub
		return gkrwDao.getAll(ns, pageNum, pageCount);
	}

	@Override
	public List<Gkrw> findAll() {
		// TODO Auto-generated method stub
		return gkrwDao.findAll();
	}

	@Override
	public PageBean<Gkrw> findAllGkrw(String start_time, String end_time, String state, String level, String content,
			Integer pageNo, Integer pageSize) {
		int totalPage = 0;
		PageBean<Gkrw> pb = new PageBean<Gkrw>();
		pb.setPageSize(pageSize);
		pb.setPageNo(pageNo);
		List rwidxx = mapDao.getJdbcTemplate()
				.queryForList("SELECT RWID FROM t_task t WHERE t.task_name like '%" + content + "%'");
		List rwidxxs = mapDao.getJdbcTemplate().queryForList("SELECT RWID FROM t_target WHERE mb_name like '%" + content
				+ "%' or task_content like '%" + content + "%' ");
		for (int i = 0; i < rwidxxs.size(); i++) {
			rwidxx.add(rwidxxs.get(i));
		}

		String rwid_str = "";
		List str_rwid = new ArrayList<String>();
		for (int i = 0; i < rwidxx.size(); i++) {
			Map mapxx = (Map) rwidxx.get(i);
			String rwid = (String) mapxx.get("RWID");
			str_rwid.add(rwid);
			if (i < rwidxx.size() - 1) {
				rwid_str = rwid_str + rwid + ",";
			} else {
				rwid_str = rwid_str + rwid;
			}
		}
		String condition = " 1 = 1 ";
		if (state.equals("1")) {
			if (start_time != null && !"".equals(start_time)) {
				condition = condition + " and start_time >= '" + start_time + " 00:00:00'";
			}
			if (end_time != null && !"".equals(end_time)) {
				condition = condition + " and start_time <= '" + end_time + " 23:59:59'";
			}
		}
		if (state.equals("2")) {
			if (start_time != null && !"".equals(start_time)) {
				condition = condition + " and end_time >= '" + start_time + " 00:00:00'";
			}
			if (end_time != null && !"".equals(end_time)) {
				condition = condition + " and end_time >'0000-00-00 00:00:00' and end_time <= '" + end_time
						+ " 23:59:59'";
			}
		}
		int totalNo = 0;
		if (rwid_str != "") {
			totalNo = mapDao.getJdbcTemplate()
					.queryForInt("SELECT COUNT(*) FROM (SELECT * FROM t_task WHERE " + condition + " " + "and state = '"
							+ state + "' and level ='" + level + "' and task_name like '%" + content
							+ "%' and rwid in (" + rwid_str + ") ) a");
		} else {
			totalNo = mapDao.getJdbcTemplate()
					.queryForInt("SELECT COUNT(*) FROM (SELECT * FROM t_task WHERE " + condition + " " + "and state = '"
							+ state + "' and level ='" + level + "' and task_name like '%" + content + "%') a");
		}
		pb.setTotalNo(totalNo);
		if (totalNo % pageSize == 0) {
			totalPage = totalNo / pageSize;
		} else {
			totalPage = (totalNo / pageSize) + 1;
		}
		pb.setTotalPage(totalPage);
		int begin = (pageNo - 1) * pageSize;
		List<Gkrw> list = gkrwDao.findByPage(begin, pageSize, condition, state, level, str_rwid);
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		if (!"".equals(list) && list != null) {
			for (int i = 0; i < list.size(); i++) {
				Gkrw gk = list.get(i);
				String strrwid = gk.getRwid();
				List xxx = mapService.getListBySql("select * from t_target where rwid = " + strrwid + "");
				List list_map = new ArrayList();
				for (int j = 0; j < xxx.size(); j++) {
					JSONObject jsonobject = null;
					Map map_xx = (Map) xxx.get(j);
					String image = map_xx.get("mb_image").toString();
					jsonobject = JSONObject.fromObject(image);
					if (jsonobject.containsKey("thumbnail")) {
						String thumbnil = jsonobject.get("thumbnail").toString();
						// String original =
						// jsonobject.get("original").toString();
						List imlist = new ArrayList();
						imlist.add(thumbnil);
						// imlist.add(original);
						for (int x = 0; x < imlist.size(); x++) {
							String format = imlist.get(x).toString().split("\\.")[1];
							String tppaths = imlist.get(x).toString();
							String tppath = tppaths.replace("M00", fdfsUrl);
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
								// file.delete();
							}
							if (dataUrl != null) {
								dataUrl = "data:image/" + format + ";base64," + dataUrl;
								if (x == 0) {
									jsonobject.remove("thumbnail");
									jsonobject.put("thumb", dataUrl);
								} else {
									jsonobject.put("original", dataUrl);
								}
							}
						}
						map_xx.put("mb_image", jsonobject.toString());
					}
					list_map.add(map_xx);
				}
				gk.setTarget(list_map);
			}
		}
		pb.setBeanList(list);
		return pb;
	}

}
