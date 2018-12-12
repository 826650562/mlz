package cn.mlight.optimizeTRAC;

import com.google.common.eventbus.EventBus;

import java.util.ArrayList;
import java.util.List;
 
public class GPSDataFactory {

	private List<String> gpsDataLines;
	private EventBus bus;

	private final long SLEEP_TIME = 1000;

	public GPSDataFactory(List<String> gpsdataLines) {
		// Importer importer = new Importer();
		gpsDataLines = gpsdataLines;
		// registerBus();
		//startFactory();
	}

	private void registerBus() {
		bus = BusProvider.getInstance();
	}

	/*
	 * private void startFactory() { Thread thread = new Thread() { public void
	 * run() { for (String string : gpsDataLines) { GPSSingleData gpsSingleData
	 * = proccessLine(string); bus.post(gpsSingleData); } } }; thread.start(); }
	 */
	public List<TPoint> startFactory() {
		KalmanFilter Kalman = new KalmanFilter();
		List<TPoint>  listps=new ArrayList<TPoint> ();
		for (String string : gpsDataLines) {
			GPSSingleData gpsSingleData = proccessLine(string);
			//bus.post(gpsSingleData);
			TPoint tp=Kalman.onLocationUpdate(gpsSingleData);
			if(tp != null){
				listps.add(tp);
			}
			
		}
		return listps;
	}

	private GPSSingleData proccessLine(String gpsLine) {
		String[] gpsParts = gpsLine.split(" ");
		return new GPSSingleData(Float.valueOf(gpsParts[1]), Double.valueOf(gpsParts[2]), Double.valueOf(gpsParts[3]),
				Long.valueOf(gpsParts[4]));
	}

	private void pauseThread(long sleepTime) {
		try {
			Thread.sleep(sleepTime);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
