package com.mlight.test;

import com.vividsolutions.jts.util.Assert;

public class SplitTest {
	public static void main(String[] args) {
		String Receivernamepath = "ces啊啊^O^1-/M00/00/05/rBAarFnEax6AL5qiAAAKVQPCdkY366.jpg";
		String yhxx = Receivernamepath.substring(0, Receivernamepath.indexOf("-"));
		String[] result = Receivernamepath.split(yhxx);
		Assert.equals(1, result.length);
		System.out.println(result[0]);
	}
}
