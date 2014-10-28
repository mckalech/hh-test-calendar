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
			@$elem = $('.b-table')
			return

		bindHandlers : () ->	
			@$elem.on 'click', '.b-cell', (e)=> 
				$currentCell = $(e.currentTarget)
				date = new Date(@curDate)
				date.setDate($currentCell.attr('data-date'))
				@hideElements({hideSg:yes})
				itemData = {
					date : date
					full : $currentCell.hasClass('b-cell_full')	
					description : $currentCell.attr('data-descr')
					name : $currentCell.attr('data-name')
				}
				@popup.showPopup(itemData)
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
			monthDataArray = []
			for dataKey of data		
				dateArray = dataKey.split('-').map((el)->parseInt(el))
				itemDate = { day : dateArray[0], month : dateArray[1], year : dateArray[2] }
				dataItem = data[dataKey]
				if dataItem and @curDate.getMonth()==itemDate.month and @curDate.getFullYear()==itemDate.year
					monthDataArray[itemDate.day] = dataItem
			templateData = {
				weeksInMonth : @curDate.weeksInMonth()
				firstDayInMonth : @curDate.firstDayInMonth()
				daysInMonth : @curDate.daysInMonth()
				monthDataArray : monthDataArray
				utils : utils
			}
			$table = _.template(tableTemplate)(templateData)
			@$elem.html($table)
			@header.setDateText(@curDate.getMonth(),@curDate.getFullYear())
			return
			
		saveItem:(item) ->
			name = item.name
			description = item.description
			date = item.date

			@$curTd.attr('data-descr', description).attr('data-name', name).addClass('b-cell_full')
				.find('.name').text(name).siblings('.descr').text(description)
			savedData = {
				date : date
				descr : description
				name : name
			}
			@data.setData(savedData, yes)	
			@popup.clearInputs()		
			@hideElements({hidePopup:yes})
			return 

		deleteItem:(item) ->
			@$curTd.removeAttr('data-descr').removeAttr('data-name').removeClass('b-cell_full')
				.find('p').text('')
			savedData = {
				date : item.date
			}
			@data.setData(savedData, no)
			@popup.clearInputs()
			@hideElements({hidePopup:yes})
			return

		setCurTd : ($tdElem) ->
			@$curTd = $tdElem;
			@$elem.find('.b-cell').removeClass('active');
			if @$curTd
				@$curTd.addClass('active');
			return
		hideElements : (options) ->
			if options.hidePopup then @popup.hidePopup()
			if options.hideSg then @sg.hideSG()
			return
			
	return Calendar