package cn.mlight.converter;

import org.apache.struts2.util.StrutsTypeConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

/**
 * Created by mlight on 2016/6/16.
 */
public class DateConverter extends StrutsTypeConverter {
	private static final Logger logger = LoggerFactory.getLogger(DateConverter.class);

	@Override
	public Object convertFromString(Map map, String[] strings, Class aClass) {
		Timestamp timestamp = null;
		String val = strings[0];
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		try {
			Date date = format.parse(val);
			timestamp = new Timestamp(date.getTime());
		} catch (Exception e) {
			logger.error(e.getLocalizedMessage(), e.getCause());
		}

		return timestamp;
	}

	@Override
	public String convertToString(Map map, Object o) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String result = "";
		if (o != null) {
			Timestamp timestamp = (Timestamp) o;
			result = format.format(timestamp.getTime());
		}
		return result;
	}
}
