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
	
	var calendObj = {
		self :null,
		today : new Date(),
		curDate : null,
		info:{},
		days : ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
		months : ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		$prevBtn : $('.prev'),
		$nextBtn : $('.next'),
		$saveBtn : $('.save'),
		$todayBtn : $('.today-btn'),
		$warning : $('.warning'),
		$monthElem : $('.month'),
		$popup : $('.cal__popup'), 
		$elem : $(this),
		$td : null,
		$curTd : null,
		init : function(){
			self = this;
			self.fullInfo();
			self.curDate = new Date();
			self.fullContainer();	
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

			self.$todayBtn.on('click',function(){
				self.curDate.setMonth(self.today.getMonth());
				self.hidePopup();
				self.fullContainer();
			});	
			
			self.$popup.find('.close, .cancel').live('click',function(){
				self.hidePopup();
			});
			
			self.$popup.find('input, textarea').live('blur',function(){				
				var text = $(this).val();
				if(text){
					$(this).parent().removeClass('empty').find('span').text(text);
				}				
			});
			self.$popup.find('.edit span').live('click',function(){
				var text = $(this).text();
				$(this).parent().addClass('empty').find('input, textarea').val(text).focus();
			});
			
			self.$td.live('click',function(e){
				self.showPopup({x:e.clientX,y:e.clientY});
				self.setCurTd($(this));
				
				//заполнение данными
				self.$popup.find('.date span').text(self.$curTd.attr('data-date')+'.'+(self.curDate.getMonth()+1)+'.'+self.curDate.getFullYear());
				
				if(self.$curTd.hasClass('full')){				
					self.$popup.find('.description').removeClass('empty').find('span').text(self.$curTd.attr('data-descr'));
					self.$popup.find('.name').removeClass('empty').find('span').text(self.$curTd.attr('data-name'));
				}else{
					self.$popup.find('.description, .name').addClass('empty').find('span').text('');
					self.$popup.find('input, textarea').val('');
				}	
			});
			
			self.$saveBtn.on('click',function(){
			
				if(self.$popup.find('.description').find('span').text() && self.$popup.find('.name').find('span').text()){
				
					self.$curTd
							.attr('data-descr',self.$popup.find('.description').find('span').text())
							.attr('data-name',self.$popup.find('.name').find('span').text())
							.addClass('full')
							.find('p').text(self.$popup.find('.name').find('span').text());
					
					self.saveInfo();
					
					self.$popup.find('input, textarea').val('');
					
					self.hidePopup();
				}
				else{
					self.$warning.addClass('visible');
				}
						
			});	
				
		},
		prevMonth : function(){
			self.curDate.setMonth(self.curDate.getMonth()-1);
		},
		nextMonth : function(){
			self.curDate.setMonth(self.curDate.getMonth()+1);
		}, 
		fullInfo : function(){
			if(localStorage['info']){
				self.info=JSON.parse(localStorage['info']);
			}
		},
		saveInfo : function(){
			var date = self.$curTd.attr('data-date');
					
			if(! self.info[self.curDate.getFullYear()]){ self.info[self.curDate.getFullYear()] = {}; }
			if(! self.info[self.curDate.getFullYear()][self.curDate.getMonth()]){ self.info[self.curDate.getFullYear()][self.curDate.getMonth()] = {}; }
			self.info[self.curDate.getFullYear()][self.curDate.getMonth()][date]={};
			
			self.info[self.curDate.getFullYear()][self.curDate.getMonth()][date].descr = self.$curTd.attr('data-descr');
			self.info[self.curDate.getFullYear()][self.curDate.getMonth()][date].name = self.$curTd.attr('data-name');

			localStorage['info']=JSON.stringify(self.info);
		},
		fullContainer : function(){

			var i = 0, j=0, d=1, dayText;	
			
			//создание таблицы и ее заполнение
			self.$elem.html('<table id="main-table" />');
			for(i=0;i<self.curDate.weeksInMonth();i++){
				
				if(i>self.curDate.weeksInMonth()) break;
				self.$elem.find('table').append('<tr />')
				j = 0;
				while(j<self.curDate.firstDayInMonth() && i==0) {					
					self.$elem.find('tr').append('<td>'+self.days[j]+'</td');
					j++;
				}
				for(;j<7;j++,d++){
					var newTd = $('<td />').appendTo(self.$elem.find('tr').last());
					if(d>self.curDate.daysInMonth()) continue;					
					dayText =  i==0 ? self.days[j] +', '+ d : d;					
					newTd.append('<div class="date">'+dayText+'</div><p></p>').attr('data-date',d).addClass('item').addClass(d==self.today.getDate() && self.curDate.getMonth()==self.today.getMonth() && self.curDate.getYear()==self.today.getYear() ? 'today' : '');
					
				}
			}
			
			//наполение информацией
			if( self.info[self.curDate.getFullYear()]&& self.info[self.curDate.getFullYear()][self.curDate.getMonth()] ){
				for(var num in self.info[self.curDate.getFullYear()][self.curDate.getMonth()]){
					self.$elem.find('td[data-date="'+num+'"]')
						.attr('data-descr',self.info[self.curDate.getFullYear()][self.curDate.getMonth()][num].descr)
						.attr('data-name',self.info[self.curDate.getFullYear()][self.curDate.getMonth()][num].name)
						.addClass('full').find('p').text(self.info[self.curDate.getFullYear()][self.curDate.getMonth()][num].name);
				}
			}
			
			//Смена названия месяца
			self.$monthElem.text(self.months[self.curDate.getMonth()]+' '+self.curDate.getFullYear());
			
			//перезаполнение переменой ячеек
			self.$td = self.$elem.find('.item');	
			
		},
		
		showPopup: function(opt){
			var newX = opt.x,
				newY = opt.y;	
			self.$popup.css({ top: newY-30, left: newX+20}).fadeIn(100);
			self.$warning.removeClass('visible');
			
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