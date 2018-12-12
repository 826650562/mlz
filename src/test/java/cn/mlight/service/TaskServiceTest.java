package cn.mlight.service;

import it.sauronsoftware.jave.*;

import java.io.File;

/**
 * Created by mlight on 2016/6/15.
 */
// @RunWith(SpringJUnit4ClassRunner.class)
// @ContextConfiguration(locations={"classpath*:applicationContext.xml"})
// @TransactionConfiguration(defaultRollback = false)
public class TaskServiceTest {
	public static void main(String[] args) throws Exception {
		String path1 = "D:\\aaa.amr";
		String path2 = "F:\\ffff.mp3";
		changeToMp3(path1, path2);
	}

	public static void changeToMp3(String sourcePath, String targetPath) {
		File source = new File(sourcePath);
		File target = new File(targetPath);
		AudioAttributes audio = new AudioAttributes();
		Encoder encoder = new Encoder();

		audio.setCodec("libmp3lame");
		EncodingAttributes attrs = new EncodingAttributes();
		attrs.setFormat("mp3");
		attrs.setAudioAttributes(audio);

		try {
			encoder.encode(source, target, attrs);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InputFormatException e) {
			e.printStackTrace();
		} catch (EncoderException e) {
			e.printStackTrace();
		}
	}
}