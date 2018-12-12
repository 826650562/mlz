package cn.mlight.dao.impl;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.List;

import net.sf.json.JSONObject;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Value;

import cn.mlight.base.dao.impl.BaseDaoImpl;
import cn.mlight.dao.MessageDao;
import cn.mlight.domain.Message;
import sun.misc.BASE64Encoder;

import javax.imageio.ImageIO;

@SuppressWarnings("unchecked")
public class MessageDaoImpl extends BaseDaoImpl<Message> implements MessageDao {
	@Value("#{settingProperties['fdfsUrl']}")
	private String fdfsUrl;
	@Override
	public Integer getCount(Message ms) {
		DetachedCriteria dc = DetachedCriteria.forClass(Message.class);
		dc.setProjection(Projections.rowCount());
		if (ms.getCreate_time() != null) {
			dc.add(Restrictions.between("creat_time", ms.getCreate_time(), ms.getCreate_time()));
		}
		if (ms.getSender() != null && ms.getSender().trim().length() > 0) {
			dc.add(Restrictions.like("sender", "%" + ms.getSender().trim() + "%"));
		}

		;
		List<Long> count = dc.getExecutableCriteria(getSession()).list();
		return count.get(0).intValue();
	}

	@Override
	public List<Message> getAll(Message ms, Integer pageNum, Integer pageCount) {
		DetachedCriteria dc = DetachedCriteria.forClass(Message.class);
		if (ms.getCreate_time() != null) {
			dc.add(Restrictions.between("creat_time", ms.getCreate_time(), ms.getCreate_time()));
		}
		if (ms.getSender() != null && ms.getSender().trim().length() > 0) {
			dc.add(Restrictions.like("sender", "%" + ms.getSender().trim() + "%"));
		}

		Criteria criteria = dc.getExecutableCriteria(getSession());
		criteria.setFirstResult((pageNum - 1) * pageCount);
		criteria.setMaxResults(pageCount);
		return criteria.list();
	}

	@Override
	public List<Message> findAll() {
		String hql = "from Message group by sender,receiver";
		Query query = this.getSession().createQuery(hql);
		return query.list();
	}

	@Override
	public List<Message> findContexts(String sender, String receiver) {
		String hql = "from Message where sender in(?,?) and receiver in(?,?)";
		Query query = this.getSession().createQuery(hql);
		query.setParameter(0, sender);
		query.setParameter(1, receiver);
		query.setParameter(2, sender);
		query.setParameter(3, receiver);
		return query.list();
	}

	@Override
	public List<Message> findObjects() {
		String hql = "from Message group by sender,receiver";
		Query query = this.getSession().createQuery(hql);
		return query.list();
	}

	@Override
	public int findCount() {
		String hql = "SELECT COUNT(*) FROM (SELECT * FROM Message GROUP BY sender,receiver) a";
		/*
		 * String sql =
		 * "SELECT COUNT(*) FROM (SELECT * FROM t_message GROUP BY sender,receiver) a"
		 * ;
		 */
		List<Long> temp = getSession().createQuery(hql).list();
		//System.out.println(temp);
		/* SQLQuery query = this.getSession().createSQLQuery(sql); */

		return temp.get(0).intValue();
	}

	@Override
	public List<Message> findByPage(int begin, int pageSize) {
		/*
		 * String hql =
		 * "SELECT a.* , getCNbyusername(a.`sender`) sn , getCNbyusername(a.`receiver`) rn FROM Message a GROUP BY sn,rn"
		 * ;
		 */
		String hql = "from Message group by sender,receiver";
		Query query = getSession().createQuery(hql);
		query.setFirstResult(begin);
		query.setMaxResults(pageSize);
		List<Message> list = query.list();
		//System.out.println(list);
		return list.size() > 0 ? list : null;
	}

	@Override
	public List<Message> findByPage(String sender, String receiver, int begin, int pageSize) {
		String hql = "from Message where sender in(?,?) and receiver in(?,?)";
		Query query = getSession().createQuery(hql);
		query.setParameter(0, sender);
		query.setParameter(1, receiver);
		query.setParameter(2, sender);
		query.setParameter(3, receiver);
		query.setFirstResult(begin);
		query.setMaxResults(pageSize);
		List<Message> list = query.list();
		return list.size() > 0 ? list : null;
	}

	@Override
	public List<Message> findByPage(String sender, String receiver, String condition, int begin, int pageSize) {
		String hql = "from Message where " + condition
				+ " and sender in(?,?) and receiver in(?,?) order by  create_time desc";
		Query query = getSession().createQuery(hql);
		query.setParameter(0, sender);
		query.setParameter(1, receiver);
		query.setParameter(2, sender);
		query.setParameter(3, receiver);
		query.setFirstResult(begin);
		query.setMaxResults(pageSize);
		List<Message> list = query.list();
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		JSONObject jsonobject = null;
		for (int i = 0; i < list.size(); i++) {
			String Attachment = list.get(i).getAttachment();
			jsonobject = JSONObject.fromObject(Attachment);
			if (jsonobject.containsKey("thumbnail")) {
				String thumbnil = jsonobject.get("thumbnail").toString();
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
					// file.delete();
				}
				if (dataUrl != null) {
					dataUrl = "data:image/" + format + ";base64," + dataUrl;
					jsonobject.put("thumbnail", dataUrl);
				}
			}
			list.get(i).setAttachment(jsonobject.toString());
		}
		return list.size() > 0 ? list : null;
	}

	@Override
	public List<Message> findByGroupid(String groupid, String condition, int begin, int pageSize) {
		String hql = "from Message where " + condition + " and  groupid = ?  GROUP BY create_time order by  create_time desc ";
		Query query = getSession().createQuery(hql);
		query.setParameter(0, groupid);
		query.setFirstResult(begin);
		query.setMaxResults(pageSize);
		List<Message> list = query.list();
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		JSONObject jsonobject = null;
		for (int i = 0; i < list.size(); i++) {
			String Attachment = list.get(i).getAttachment();
			jsonobject = JSONObject.fromObject(Attachment);
			if (jsonobject.containsKey("thumbnail")) {
				String thumbnil = jsonobject.get("thumbnail").toString();
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
					// file.delete();
				}
				if (dataUrl != null) {
					dataUrl = "data:image/" + format + ";base64," + dataUrl;
					jsonobject.put("thumbnail", dataUrl);
				}
			}
			list.get(i).setAttachment(jsonobject.toString());
		}
		return list.size() > 0 ? list : null;
	}

}
