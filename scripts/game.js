Date.prototype.daysInMonth = function() {
	return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};
Date.prototype.weeksInMonth = function() {
	
	var count = 0;
	count = (this.daysInMonth()%7>0 || this.firstDayInMonth()!=0) ? 5 : 4;
	if( this.daysInMonth()%7 > 7-this.firstDayInMonth()){
		count++;
	}
	return count;
};
Date.prototype.firstDayInMonth = function() {
	return new Date(this.getFullYear(), this.getMonth(), 1).getNormalDay();
};
Date.prototype.getNormalDay = function() {
	return this.getDay()>0 ? this.getDay()-1 : 6;
};



$.fn.calendar = function(){
	
	var calendObj ={
		today : new Date(),
		curDate : null,
		prevBtn : $('.prev'),
		nextBtn : $('.next'),
		$elem : $(this),
		init : function(){
			curDate = this.today;
			this.fullContainer();
			this.bindHandlers();
		},
		bindHandlers : function(){
			var that = this;
			that.prevBtn.on('click',function(){
				that.prevMonth();
				that.fullContainer();
			});
			that.nextBtn.on('click',function(){
				that.nextMonth();
				that.fullContainer();
			});
		},
		prevMonth : function(){
			curDate.setMonth(curDate.getMonth()-1);
		},
		nextMonth : function(){
			curDate.setMonth(curDate.getMonth()+1);
		}, 
		fullContainer : function(){

			var i = 0, j=0, d=1;	
			this.$elem.html('');
			for(i=0;i<curDate.weeksInMonth();i++){
				
				j = 0;
				while(j<curDate.firstDayInMonth() && i==0) {
					j++;
					this.$elem.append('<span></span>');
				}
				for(;j<7;j++,d++){
					if(d>curDate.daysInMonth()) break;
					this.$elem.append('<span>'+d+'</span>');
				}
				this.$elem.append('<br>');
			}
		}
	}

	calendObj.init();
}

$(function(){
	$('.container').calendar();
	
});