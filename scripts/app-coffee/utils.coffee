define [], () ->
	Date.prototype.daysInMonth = () ->
		33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate()

	Date.prototype.weeksInMonth = () ->
		count = if this.daysInMonth()%7>0 or this.firstDayInMonth()!=0 then 5 else 4
		if this.daysInMonth()%7 > 7-this.firstDayInMonth()
			count++
		count

	Date.prototype.firstDayInMonth = () ->
		new Date(this.getFullYear(), this.getMonth(), 1).getNormalDay()

	Date.prototype.getNormalDay = () ->
		if this.getDay()>0 then this.getDay()-1 else 6

	String.prototype.replaceAll = (search, replace) ->
		this.split(search).join(replace)


	return {
		days 		:	['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
		months 		:	['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
		monthSklon 	: 	['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
	}