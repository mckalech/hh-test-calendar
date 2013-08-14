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

$(function(){
	var i = 0, j=0, d=1,
	today = new Date(2012,6,1);
	
	for(i=0;i<today.weeksInMonth();i++){
		
		j = 0;
		while(j<today.firstDayInMonth() && i==0) {
			j++;
			$('html').append('<span></span>');
		}
		for(;j<7;j++,d++){
			if(d>today.daysInMonth()) break;
			$('html').append('<span>'+d+'</span>');
		}
		$('html').append('<br>');
	}
	
});