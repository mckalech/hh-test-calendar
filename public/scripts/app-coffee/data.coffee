define ['jquery', 'underscore'], ($,_) ->
	class Data
		info : {}
		constructor: (calendar) ->
			if localStorage['info']
				@info=JSON.parse(localStorage['info'])
			@calendar = calendar

		getData : () ->
			return @info
		getSortedData : () ->
			data= []
			for key, value of @getData()	
				data.push({
					dateKey : key
					info : value
				})
			_.sortBy(data, (item) ->
				date = new Date()
				dateArray = @parseKeyToArray(item.dateKey)
				date.setDate(dateArray[0])
				date.setMonth(dateArray[1])
				date.setFullYear(dateArray[2])
				date.getTime()
			,@)
		setData : (options, save) ->
			key= "#{options.date.getDate()}-#{options.date.getMonth()}-#{options.date.getFullYear()}"	
			if save
				@info[key]={}
				@info[key].description = options.description
				@info[key].name = options.name
			else
				delete @info[key]
			localStorage['info']=JSON.stringify(@info)
			return
		getMonthData : (month, year) ->
			data = @getData()
			monthDataArray = []
			for dataKey of data		
				dateArray = @parseKeyToArray(dataKey)
				itemDate = { day : dateArray[0], month : dateArray[1], year : dateArray[2] }
				dataItem = data[dataKey]
				if dataItem and month is itemDate.month and year is itemDate.year
					monthDataArray[itemDate.day] = dataItem
			return monthDataArray
		getDayData : (date) ->
			key= "#{date.getDate()}-#{date.getMonth()}-#{date.getFullYear()}"	
			data = @getData()
			data[key]
		parseKeyToArray : (key) ->
			key.split('-').map((el)->parseInt(el))

	return Data