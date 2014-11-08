define ['jquery', 'underscore', 'backbone', 'utils', 'header', 'data', 'sg', 'popup', 'text!../templates/table.html'], ($, _, Backbone, utils, HeaderView, Data, SGView, PopupView, tableTemplate) ->
	CalendarView = Backbone.View.extend({
		el : $('.b-table') 
		initialize : (options)->
			@today = new Date()
			@curDate = new Backbone.Model({date: new Date()})
			@$curTd = null
			@data = new Data(this)
			@header = new HeaderView({calendar:this})
			@sg = new SGView({calendar:this})
			@popup = new PopupView({calendar:this})
			@bindHandlers()
			@render()
			return
		events : {
			'click .b-cell' : 'cellClick'
		}
		render : ()->
			templateData = {
				weeksInMonth : @curDate.get('date').weeksInMonth()
				firstDayInMonth : @curDate.get('date').firstDayInMonth()
				daysInMonth : @curDate.get('date').daysInMonth()
				monthDataArray : @data.getMonthData(@curDate.get('date').getMonth(),@curDate.get('date').getFullYear())
				todayDay : @today.getDate()
				isTodayMonth : @curDate.get('date').getMonth() is @today.getMonth() and @curDate.get('date').getYear() is @today.getYear()
				utils : utils
			}
			$table = _.template(tableTemplate)(templateData)
			@$el.html($table)
			@header.setDateText(@curDate.get('date').getMonth(),@curDate.get('date').getFullYear())
			return
		cellClick : (e) -> 
			$currentCell = $(e.currentTarget)
			date = new Date(@curDate.get('date'))
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
		bindHandlers : () ->	
			@curDate.on('change', (model, value, options)->
				@hideElements({hidePopup:yes, hideSg:yes})
				@render()
				return
			, @)
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
			@$el.find('.b-cell').removeClass('active');
			if @$curTd
				@$curTd.addClass('active');
			return
		hideElements : (options) ->
			if options.hidePopup then @popup.hidePopup()
			if options.hideSg then @sg.hideSG()
			return
	})
	return CalendarView
