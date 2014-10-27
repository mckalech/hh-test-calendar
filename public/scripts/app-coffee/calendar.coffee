define ['jquery','underscore', 'utils', 'header', 'data', 'sg', 'popup', 'text!../templates/table.html'], ($, _, utils, Header, Data, SG, Popup, tableTemplate) ->
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
				$currentCell = $(e.currentTarget)
				date = new Date(@curDate)
				date.setDate($currentCell.attr('data-date'))
				@hideElements({hideSg:yes})
				options = {
					x : e.clientX
					y : e.clientY
					date : date
					full : $currentCell.hasClass('full')	
					description : $currentCell.attr('data-descr')
					name : $currentCell.attr('data-name')
				}
				@popup.showPopup(options)
				@setCurTd($currentCell)
				return
			return

		prevMonth : () ->
			@curDate.setMonth(@curDate.getMonth()-1)
			return

		nextMonth : () ->
			@curDate.setMonth(@curDate.getMonth()+1)
			return
			
		fullContainer : () ->
			data = @data.getData()
			templateData = {
				weeksInMonth : @curDate.weeksInMonth()
				firstDayInMonth : @curDate.firstDayInMonth()
				daysInMonth : @curDate.daysInMonth()
				utils : utils
			}
			$table = _.template(tableTemplate)(templateData)
			@$elem.html($table)
			
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
			
		saveItem:(options) ->
			name = options.name
			description = options.description
			date = options.date

			@$curTd
				.attr('data-descr', description)
				.attr('data-name', name)
				.addClass('full')
				.find('.name').text(name)
				.siblings('.descr').text(description)
			opt = {
				day : date.getDate()
				curDate : date
				descr : description
				name : name
			}
			@data.setData(opt, yes)	
			@popup.$popup.find('input, textarea').val('')			
			@hideElements({hidePopup:yes})
			return 

		deleteItem:(options) ->
			@$curTd
				.removeAttr('data-descr')
				.removeAttr('data-name')
				.removeClass('full')
				.find('p').text('')
			opt = {
				day : options.date.getDate()
				curDate : options.date
			}
			@data.setData(opt, no)
			@popup.$popup.find('input, textarea').val('')
			@hideElements({hidePopup:yes})
			return

		setCurTd : ($tdElem) ->
			@$curTd = $tdElem;
			@$elem.find('.item').removeClass('active');
			if @$curTd
				@$curTd.addClass('active');
			return
		hideElements : (options) ->
			if options.hidePopup then @popup.hidePopup()
			if options.hideSg then @sg.hideSG()
			return
			
	return Calendar


