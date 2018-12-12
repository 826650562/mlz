package com.mlight.chat.service.models.message;

public class ImageInfo {

	public static int normalImage = 0;
	public static int encryptImage = 1;
	private String thumbnail;
	private String original;
	private String thumbWidth;
	private String thumbHeight;
	private String originalWidth;
	private String originalHeight;
	private int imageType;// 0 普通图片，1 加密图片
	private String area;

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public String getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}

	public String getOriginal() {
		return original;
	}

	public void setOriginal(String original) {
		this.original = original;
	}

	public String getThumbWidth() {
		return thumbWidth;
	}

	public int getImageType() {
		return imageType;
	}

	public void setImageType(int imageType) {
		this.imageType = imageType;
	}

	public void setThumbWidth(String thumbWidth) {
		this.thumbWidth = thumbWidth;
	}

	public String getThumbHeight() {
		return thumbHeight;
	}

	public void setThumbHeight(String thumbHeight) {
		this.thumbHeight = thumbHeight;
	}

	public String getOriginalWidth() {
		return originalWidth;
	}

	public void setOriginalWidth(String originalWidth) {
		this.originalWidth = originalWidth;
	}

	public String getOriginalHeight() {
		return originalHeight;
	}

	public void setOriginalHeight(String originalHeight) {
		this.originalHeight = originalHeight;
	}
}
