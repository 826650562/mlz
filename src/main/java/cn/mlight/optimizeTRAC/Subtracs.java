package cn.mlight.optimizeTRAC;
import java.util.ArrayList;
import java.util.List;
 
 
public class Subtracs {
   
	private List<TPoint> allpoints;
	private List<List<TPoint>> subpoints;
	private final int maxTime=1000*300;   //轨迹分段 是5分钟
	private final int stayRadius=10; 
	private final int minSize=3; 
	
	public Subtracs(List<TPoint> tps){
		this.allpoints=tps;
		this.subpoints=new ArrayList<List<TPoint>>();
		//this.subTrajects();
	}
	
	public List<List<TPoint>>  subTrajects(){
		subpoints.add(new ArrayList<TPoint>());
		int sum=0;
		for(int i=1;i<this.allpoints.size();i++){
			TPoint p=this.allpoints.get(i-1);
			TPoint p2=this.allpoints.get(i);
			if(p2.sjc-p.sjc>=maxTime){
				subpoints.add(new ArrayList<TPoint>());
				sum++;
			}else{
				subpoints.get(sum).add(p);
			}
		}
		//System.out.println(subpoints);
		return subpoints;
	}
}
