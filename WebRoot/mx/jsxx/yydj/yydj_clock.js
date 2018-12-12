/**
 *
 * @authors Steve Chan (you@example.org)
 * @date    2017-06-08 10:09:00
 * @version $Id$
 */

/**
  计时器模块
**/

function myClock() {
	this.HH= 0;
    this.mm = 0;
    this.ss = 0;
    this.str = '';
	this.startTimer = function(){
		var that = this;
        window.Timer = setTimeout(function() {
        	that.str = "";
            if (++ that.ss == 60) {
                if (++ that.mm == 60) {
                	that.HH++;
                	that.mm = 0;
                }
                that.ss = 0;
            }
            that.str += that.HH < 10 ? "0" + that.HH : that.HH;
            that.str += ":";
            that.str += that.mm < 10 ? "0" + that.mm : that.mm;
            that.str += ":";
            that.str += that.ss < 10 ? "0" + that.ss : that.ss;
            
            document.getElementById("jsq").innerHTML = that.str;
            
            that.startTimer();
            
        }, 1000);
	}
	this.resetTimer = function(){
		this.mm = 0;
		this.ss = 0;
		this.str = '';
		this.HH = 0;
	};
	this.stopTimer = function(){
		clearTimeout(window.Timer);
	};
}

