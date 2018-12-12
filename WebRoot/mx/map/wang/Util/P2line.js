/** 根据两点求出垂线过第三点的直线的交点
    param pt1 直线上的第一个点
    param pt2 直线上的第二个点
    param pt3 垂线上的点
    return 返回点到直线的垂直交点坐标
*/
function crossPoint(pt1,pt2,pt3){
    var A = (pt1.y-pt2.y)/(pt1.x- pt2.x);
    var B = (pt1.y-A*pt1.x);
    /// > 0 = ax +b -y;  对应垂线方程为 -x -ay + m = 0;(mm为系数)
    /// > A = a; B = b;
    var m = pt3.x+A*pt3.y;
    /// 求两直线交点坐标
    var ptCross={x:0,y:0};
    ptCross.x=(m-A*B)/(A*A+1);
    ptCross.y=A*ptCross.x+B;
    return ptCross;
}

/** 根据两点求出点到直线的最短距离
    param pt1 直线上的第一个点
    param pt2 直线上的第二个点
    param pt3 垂线上的点
    return 返回点到直线的最短距离
*/
function p2line_shortest(pt1,pt2,pt3){
    var A = (pt1.y-pt2.y)/(pt1.x- pt2.x);
    var B = (pt1.y-A*pt1.x);
    /// > 0 = ax +b -y;
    return Math.abs(A*pt3.x + B-pt3.y)/Math.sqrt(A*A + 1);
}