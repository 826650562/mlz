package cn.mlight.utils;

import java.util.List;

public class PageBean<T> {

	private Integer pageNo = 0;// 当前页码
	private Integer pageSize = 10;// 每页记录数
	private Integer totalNo = 0;
	private Integer totalPage = 0;
	private List<T> beanList;

	public Integer getPageNo() {
		return pageNo;
	}

	public void setPageNo(Integer pageNo) {
		this.pageNo = pageNo;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public Integer getTotalNo() {
		return totalNo;
	}

	public void setTotalNo(Integer totalNo) {
		this.totalNo = totalNo;
		totalPage = (this.totalNo + pageSize - 1) / pageSize;
	}

	public Integer getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(Integer totalPage) {
		this.totalPage = totalPage;
	}

	public List<T> getBeanList() {
		return beanList;
	}

	public void setBeanList(List<T> beanList) {
		this.beanList = beanList;
	}

	@Override
	public String toString() {
		return "PageBean [pageNo=" + pageNo + ", pageSize=" + pageSize + ", totalNo=" + totalNo + ", totalPage="
				+ totalPage + ", beanList=" + beanList + "]";
	}

	public int getFirst() {
		int first = this.getPageSize() * (this.getPageNo() - 1);
		if (first < 0) {
			first = 0;
		}
		return first;
	}
}
