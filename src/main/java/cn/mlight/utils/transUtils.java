package cn.mlight.utils;

import java.io.File;
import it.sauronsoftware.jave.AudioAttributes;
import it.sauronsoftware.jave.Encoder;
import it.sauronsoftware.jave.EncoderException;
import it.sauronsoftware.jave.EncodingAttributes;
import it.sauronsoftware.jave.InputFormatException;

public class transUtils {
	public static void wav2amr(String fromUrl, String toUrl)
			throws IllegalArgumentException, InputFormatException, EncoderException {
		File source = new File(fromUrl);
		File target = new File(toUrl);
		AudioAttributes audio = new AudioAttributes();
		audio.setCodec("libopencore_amrnb");
		audio.setBitRate(new Integer(12200));
		audio.setChannels(new Integer(1));
		audio.setSamplingRate(new Integer(8000));
		EncodingAttributes attrs = new EncodingAttributes();
		attrs.setFormat("wav");
		attrs.setAudioAttributes(audio);
		Encoder encoder = new Encoder();
		try {
			encoder.encode(source, target, attrs);
		} catch (EncoderException e) {
			// 经常报错，忽略
			System.out.println(e);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public static void wavtoamr(String orl, String tar) {
		//boolean msg = false;
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
	}
	public static void main(String[] args) {
		try {
			Encoder encoder = new Encoder();
			for(String i : encoder.getAudioEncoders()){
				System.out.println(i);
			}
			System.out.println(System.getProperty("java.io.tmpdir"));
			wav2amr("D:\\apache-tomcat-7.0.79\\webapps\\gkzh_zhd\\temp_file\\mlight-temp1502093542353_2547.wav", "D:\\apache-tomcat-7.0.79\\webapps\\gkzh_zhd\\temp_file\\b.amr");
		} catch (IllegalArgumentException | EncoderException e) {
			e.printStackTrace();
		}
	}
}
