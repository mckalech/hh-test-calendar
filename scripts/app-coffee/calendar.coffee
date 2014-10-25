define ['jquery', 'utils', 'header', 'data', 'sg', 'popup'], ($, utils, Header, Data, SG, Popup) ->
	class Calendar 
		today		:	new Date()
		curDate		:	new Date()
		$curTd 		: 	null
		
		constructor: () ->
			@initHtml()
			@data = new Data(this)
			@header = new Header(this)
			@sg = new SG(this)
			@popup = new Popup(this)
			@fullContainer()
			@bindHandlers()
		initHtml : () ->
			@$elem = $('.container')
			return

		bindHandlers : () ->	
			@$elem.on 'click', '.item', (e)=> 
				@popup.showPopup({x:e.clientX,y:e.clientY})
				@setCurTd($(e.currentTarget))
				@popup.$popup.find('.date span').text("#{@$curTd.attr('data-date')} #{utils.monthSklon[@curDate.getMonth()]}")		
				if @$curTd.hasClass('full')				
					@popup.$popup.find('.description').removeClass('empty').find('span').text(@$curTd.attr('data-descr'))
					@popup.$popup.find('.name').removeClass('empty').find('span').text(@$curTd.attr('data-name'))
				else
					@popup.$popup.find('.description, .name').addClass('empty').find('span').text('')
					@popup.$popup.find('input, textarea').val('')
				return
			
			return

		prevMonth : () ->
			@curDate.setMonth(@curDate.getMonth()-1)
			return

		nextMonth : () ->
			@curDate.setMonth(@curDate.getMonth()+1)
			return
			
		fullContainer : () ->
			d=1
			data = @data.getData()
			@$elem.html('<table id="main-table" cellpadding=0 cellspacing=0 />');
			for i in [0...@curDate.weeksInMonth()]		
				if i>@curDate.weeksInMonth() then break;
				@$elem.find('table').append('<tr />')
				j = 0
				while j<@curDate.firstDayInMonth() and i==0 					
					@$elem.find('tr').append("<td><div class='date'>#{utils.days[j]}</div></td>")
					j++
				
				for j in [j...7]
					newTd = $('<td />').appendTo(@$elem.find('tr').last())
					if d>@curDate.daysInMonth() then continue					
					dayText =  if i==0 then "#{utils.days[j]}, #{d}" else d					
					newTd.append("<div class='date'>#{dayText}</div><p class='name'></p><p class='descr'></p>").attr('data-date',d).addClass('item').addClass(if d==@today.getDate() and @curDate.getMonth()==@today.getMonth() and @curDate.getYear()==@today.getYear() then 'today' else '');
					d++
			
			for key of data		
				dateMas = key.split('-').map((el)->parseInt(el))
				d = dateMas[0]
				m = dateMas[1]
				y = dateMas[2]
				if data[key] and @curDate.getMonth()==m and @curDate.getFullYear()==y
					@$elem.find("td[data-date='#{d}']")
						.attr('data-descr',data[key].descr)
						.attr('data-name',data[key].name)
						.addClass('full').find('.name').text(data[key].name)
						.siblings('.descr').text(data[key].descr)
			
			@header.$monthElem.text("#{utils.months[@curDate.getMonth()]} #{@curDate.getFullYear()}")
			return
			
		saveItem:() ->
			@$curTd
				.attr('data-descr',@popup.$popup.find('.description').find('span').text())
				.attr('data-name',@popup.$popup.find('.name').find('span').text())
				.addClass('full')
				.find('.name').text(@popup.$popup.find('.name').find('span').text())
				.siblings('.descr').text(@popup.$popup.find('.description').find('span').text())
			options = {
				day : @$curTd.attr('data-date')
				curDate : @curDate
				descr : @$curTd.attr('data-descr')
				name : @$curTd.attr('data-name')
			}
			@data.setData(options, yes)	
			@popup.$popup.find('input, textarea').val('')			
			@popup.hidePopup()
			return 

		deleteItem:() ->
			@$curTd
				.removeAttr('data-descr')
				.removeAttr('data-name')
				.removeClass('full')
				.find('p').text('')
			options = {
				day : @$curTd.attr('data-date')
				curDate : @curDate
			}
			@data.setData(options, no)
			@popup.$popup.find('input, textarea').val('')
			@popup.hidePopup()
			return

		setCurTd : ($tdElem) ->
			@$curTd = $tdElem;
			@$elem.find('.item').removeClass('active');
			if @$curTd
				@$curTd.addClass('active');
			return
			
	return Calendar


