package cn.mlight.optimizeTRAC;


import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.joda.time.DateTime;

/**
 * 原始采样记录，用于从文本文件中加载数据
 * 
 * @author louispc
 * 
 */
public class SampleRecord implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8794107404448302606L;
	public int TaxiId;
	public String Alarm;
	public String Empty;
	public String Light;
	public String Highway;
	public String Brake;
	public DateTime RecTime; // 暂不使用这个接受时间
	public DateTime MeaTime;
	public double Lon;
	public double Lat;
	public double Velocity;
	public double Direction;

	public static SampleRecord Parse(String line) {
		String[] ss = line.split(",");
		if (ss.length >= 12) {
			try {
				SampleRecord r = new SampleRecord();
				int tid = Integer.parseInt(ss[0]);
				String alarm = ss[1].trim();
				String empty = ss[2].trim();
				String light = ss[3].trim();
				String highway = ss[4].trim();
				String brake = ss[5].trim();
				DateTime rec = StrToDate(ss[6]);
				DateTime mea = StrToDate(ss[7]);
				double lon = Double.parseDouble(ss[8]);
				double lat = Double.parseDouble(ss[9]);
				double v = Double.parseDouble(ss[10]);
				double d = Double.parseDouble(ss[11]);
				r.TaxiId = tid;
				r.Alarm = alarm;
				r.Empty = empty;
				r.Light = light;
				r.Highway = highway;
				r.Brake = brake;
				r.RecTime = rec;
				r.MeaTime = mea;
				r.Lon = lon;
				r.Lat = lat;
				r.Velocity = v;
				r.Direction = d;
				return r;
			} catch (Exception ex) {
				System.out.println("Parse SampleRecord error." + line);
			}
		}
		return null;
	}

	public static DateTime StrToDate(String str) throws ParseException {
		String pattern = "yyyy-MM-dd HH:mm:ss";
		DateTime datetime = null;
		SimpleDateFormat format = new SimpleDateFormat(pattern);
		try {
			Date date = format.parse(str);
			if (date != null) {
				datetime = new DateTime(date);
			}
		} catch (ParseException e) {
			// e.printStackTrace();
			throw e;
		}

		return datetime;
	}
}
