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

var info = {
	2013:{
		7:{
			14:{
				text:"dasdas"
			},
			16:{
				text:"dddd"
			}
		},
		8:{
			1:{
				text:"hello, world"
			}
		}
	}
}

$.fn.calendar = function(){
	
	var calendObj = {
		self :null,
		today : new Date(),
		curDate : null,
		days : ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
		months : ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		$prevBtn : $('.prev'),
		$nextBtn : $('.next'),
		$monthElem : $('.month'),
		$popup : $('.cal__popup'), 
		$elem : $(this),
		$td : null,
		$curTd : null,
		init : function(){
			self = this;
			self.curDate = self.today;
			self.fullContainer();
			self.$td = self.$elem.find('.item');		
			self.bindHandlers();
		},
		bindHandlers : function(){
			self.$prevBtn.on('click',function(){
				self.prevMonth();
				self.hidePopup();
				self.fullContainer();
			});
			self.$nextBtn.on('click',function(){
				self.nextMonth();
				self.hidePopup();
				self.fullContainer();
			});
			self.$elem.find('.full').live('click',function(){
				//alert($(this).attr('data-info'));
			
			});
			self.$td.live('click',function(e){
				self.showPopup({x:e.clientX,y:e.clientY});
				self.setCurTd($(this));
			});
			
			self.$popup.find('.close').live('click',function(){
				self.hidePopup();
			});
			
			self.$popup.find('input, textarea').live('blur',function(){				
				var text = $(this).val();
				if(text){
					$(this).parent().removeClass('empty').find('span').text(text);
				}				
			});
			self.$popup.find('p span').live('click',function(){
				var text = $(this).text();
				$(this).parent().addClass('empty').find('input, textarea').val(text).focus();
			});
			
			
				
		},
		prevMonth : function(){
			self.curDate.setMonth(self.curDate.getMonth()-1);
		},
		nextMonth : function(){
			self.curDate.setMonth(self.curDate.getMonth()+1);
		}, 
		fullContainer : function(){

			var i = 0, j=0, d=1, dayText;	
			
			//создание таблицы и ее заполнение
			self.$elem.html('<table id="main-table" cellspacing="0"></table>');
			for(i=0;i<self.curDate.weeksInMonth();i++){
				self.$elem.find('table').append('<tr />')
				j = 0;
				while(j<self.curDate.firstDayInMonth() && i==0) {					
					self.$elem.find('tr').append('<td>'+self.days[j]+'</td');
					j++;
				}
				for(;j<7;j++,d++){
				
					if(d>self.curDate.daysInMonth()) break;
					dayText =  i==0 ? self.days[j] +', '+ d : d;
					$('<td>'+dayText+'</td>').attr('data-date',d).addClass('item').addClass(d==self.today.getDate() ? 'today' : '').appendTo(self.$elem.find('tr').last());
					
				}
			}
			
			//наполение информацией
			if( info[self.curDate.getFullYear()]&& info[self.curDate.getFullYear()][self.curDate.getMonth()] ){
				for(var num in info[self.curDate.getFullYear()][self.curDate.getMonth()]){
					self.$elem.find('td[data-date="'+num+'"]').attr('data-info',info[self.curDate.getFullYear()][self.curDate.getMonth()][num].text).addClass('full');
				}
			}
			
			//Смена названия месяца
			self.$monthElem.text(self.months[self.curDate.getMonth()]);
			
		},
		
		showPopup: function(opt){
			var newX = opt.x,
				newY = opt.y;
				
			self.$popup.css({ top: newY-33, left: newX+17}).fadeIn(100);
		},
		
		hidePopup: function(){
			self.$popup.fadeOut(100);
			self.setCurTd(null);
		},
		setCurTd : function($tdElem){
			self.$curTd = $tdElem;
			self.$td.removeClass('active');
			if(self.$curTd){
				self.$curTd.addClass('active');
			}
			
		}
	}

	calendObj.init();
}

$(function(){
	$('.container').calendar();
	
});