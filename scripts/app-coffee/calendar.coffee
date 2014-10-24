define ['jquery', 'utils', 'header'], ($, utils, Header) ->
	class Calendar 
		today		:	new Date()
		curDate		:	null
		info		:	{}
		days 		:	utils.days
		months 		:	utils.months
		monthSklon 	: 	utils.monthSklon
		$td 		: 	null
		$curTd 		: 	null
		
		constructor: () ->
			@initHtml()
			@fullInfo()
			@curDate = new Date()
			@header = new Header(this)
			@fullContainer()
			@bindHandlers()
		initHtml : () ->
			@$saveBtn 	= 	$('.save')
			@$delBtn 	= 	$('.delete')
			@$searchQ 	= 	$('.search')
			@$searchSug	= 	$('.sug')
			@$warning 	= 	$('.warning')
			@$popup 	= 	$('.cal__popup')
			@$elem 		= 	$('.container')
			return

		bindHandlers : () ->
			@$searchQ.bind 'keyup', (e) =>
				query=$(e.currentTarget).val()
				isWords=no
				@$searchSug.html('')
				if query.length>2
					@$searchSug.show()
					isWords = no
					for index, value of @info			
						if value.descr.toLowerCase().indexOf(query.toLowerCase())>=0
							replStr = value.descr.replaceAll(query,"<b>#{query}</b>")
							@$searchSug.append("<li data-date='#{index}'><p>#{replStr}</p><span>#{index.split('-')[0]} #{@monthSklon[index.split('-')[1]]}</span></li")
							isWords=yes
						else if value.name.indexOf(query)>=0
							replStr = value.name.replaceAll(query,"<b>#{query}</b>")
							@$searchSug.append("<li data-date='#{index}'><p>#{replStr}</p><span>#{index.split('-')[0]} #{@monthSklon[index.split('-')[1]]}</span></li")
							isWords=yes
					@$searchSug.hide() unless isWords
				else
					@$searchSug.hide()
				return
			
			@$searchSug.on 'click', 'li', (e)=>
				dateMas=$(e.currentTarget).attr('data-date').split('-')
				@curDate.setMonth(dateMas[1])
				@curDate.setYear(dateMas[2])
				@fullContainer()
				@$searchSug.html('').hide()
				@$searchQ.val('')
				return
			
			@$popup.find('.close').on 'click', () =>
				@hidePopup()
				return
			
			@$popup.find('input, textarea').on 'blur', (e)=>			
				text = $(e.currentTarget).val()
				$(e.currentTarget).parent().removeClass('empty').find('span').text(text) if text
				return

			@$popup.on 'click', '.edit span', (e)=>
				text = $(e.currentTarget).text()
				$(e.currentTarget).parent().addClass('empty').find('input, textarea').val(text).focus()
				return
			
			@$elem.on 'click', '.item', (e)=> 
				@showPopup({x:e.clientX,y:e.clientY})
				@setCurTd($(e.currentTarget))
				@$popup.find('.date span').text("#{@$curTd.attr('data-date')} #{@monthSklon[@curDate.getMonth()]}")		
				if @$curTd.hasClass('full')				
					@$popup.find('.description').removeClass('empty').find('span').text(@$curTd.attr('data-descr'))
					@$popup.find('.name').removeClass('empty').find('span').text(@$curTd.attr('data-name'))
				else
					@$popup.find('.description, .name').addClass('empty').find('span').text('')
					@$popup.find('input, textarea').val('')
				return
			
			@$saveBtn.on 'click', ()=>
			
				if @$popup.find('.description').find('span').text() and @$popup.find('.name').find('span').text()		
					@$curTd
						.attr('data-descr',@$popup.find('.description').find('span').text())
						.attr('data-name',@$popup.find('.name').find('span').text())
						.addClass('full')
						.find('.name').text(@$popup.find('.name').find('span').text())
						.siblings('.descr').text(@$popup.find('.description').find('span').text())
					
					@saveInfo(yes)	
					@$popup.find('input, textarea').val('')			
					@hidePopup()
				else
					@$warning.addClass('visible')
				return		

			@$delBtn.on 'click', ()=>
				@$curTd
					.removeAttr('data-descr')
					.removeAttr('data-name')
					.removeClass('full')
					.find('p').text('')
				
				@$popup.find('input, textarea').val('')
				@saveInfo()
				@hidePopup()
				return

			return

		prevMonth : () ->
			@curDate.setMonth(@curDate.getMonth()-1)
			return

		nextMonth : () ->
			@curDate.setMonth(@curDate.getMonth()+1)
			return

		fullInfo : () ->
			if localStorage['info']
				@info=JSON.parse(localStorage['info'])
			return

		saveInfo : (save) ->
			date = @$curTd.attr('data-date')
			key= "#{date}-#{@curDate.getMonth()}-#{@curDate.getFullYear()}"	
			if save
				@info[key]={}
				@info[key].descr = @$curTd.attr('data-descr')
				@info[key].name = @$curTd.attr('data-name')
			else
				delete @info[key]
			localStorage['info']=JSON.stringify(@info)
			return
			
		fullContainer : () ->
			d=1
			@$elem.html('<table id="main-table" cellpadding=0 cellspacing=0 />');
			for i in [0...@curDate.weeksInMonth()]		
				if i>@curDate.weeksInMonth() then break;
				@$elem.find('table').append('<tr />')
				j = 0
				while j<@curDate.firstDayInMonth() and i==0 					
					@$elem.find('tr').append("<td><div class='date'>#{@days[j]}</div></td>")
					j++
				
				for j in [j...7]
					newTd = $('<td />').appendTo(@$elem.find('tr').last())
					if d>@curDate.daysInMonth() then continue					
					dayText =  if i==0 then "#{@days[j]}, #{d}" else d					
					newTd.append("<div class='date'>#{dayText}</div><p class='name'></p><p class='descr'></p>").attr('data-date',d).addClass('item').addClass(if d==@today.getDate() and @curDate.getMonth()==@today.getMonth() and @curDate.getYear()==@today.getYear() then 'today' else '');
					d++
			
			for key of @info			
				dateMas = key.split('-').map((el)->parseInt(el))
				d = dateMas[0]
				m = dateMas[1]
				y = dateMas[2]
				if @info[key] and @curDate.getMonth()==m and @curDate.getFullYear()==y
					@$elem.find("td[data-date='#{d}']")
						.attr('data-descr',@info[key].descr)
						.attr('data-name',@info[key].name)
						.addClass('full').find('.name').text(@info[key].name)
						.siblings('.descr').text(@info[key].descr)
			
			@header.$monthElem.text("#{@months[@curDate.getMonth()]} #{@curDate.getFullYear()}")
			@$td = @$elem.find('.item')	
			return
			
		showPopup: (opt) ->
			newX = opt.x
			newY = opt.y
			@$popup.css({ top: newY-30, left: newX+20}).fadeIn(100)
			@$warning.removeClass('visible')
			return
		
		hidePopup:() ->
			@$popup.fadeOut(100)
			@setCurTd(null)
			return

		setCurTd : ($tdElem) ->
			@$curTd = $tdElem;
			@$td.removeClass('active');
			if @$curTd
				@$curTd.addClass('active');
			return
			
	return Calendar


