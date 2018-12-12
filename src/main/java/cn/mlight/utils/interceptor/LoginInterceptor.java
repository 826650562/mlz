package cn.mlight.utils.interceptor;

import cn.mlight.domain.User;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class LoginInterceptor extends AbstractInterceptor {

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		String actionName = invocation.getProxy().getAction().getClass().getName();
		String methodName = invocation.getProxy().getMethod();
		String allName = actionName + "." + methodName;

		if ("cn.mlight.action.LoginAction.login".equals(allName)) {
			return invocation.invoke();
		}
		if ("cn.mlight.action.LoginAction.now".equals(allName)) {
			return invocation.invoke();
		}
		User user = (User) ActionContext.getContext().getSession().get("sessionUser");
		if (user == null) {
			return "noLogin";
		}

		return invocation.invoke();
	}

}
