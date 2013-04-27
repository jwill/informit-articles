$(document).ready ()->
	myEditor = new YAHOO.widget.Editor('msgpost', {
			height: '300px',
			width: '522px',
			dompath: true,
			animate: true 
	})
	myEditor.render()
	window.editor = myEditor
	window.createPost = ()->
		console.log("create")
		window.editor.saveHTML()
		content = window.editor.get('element').value
		title = $("#title").val();
		author = $("#author").val()
		data = {'content':content, 'title':title}
		s = (data) ->
				console.log(data)
				window.location = "/"
		$.ajax({
			type: 'POST',
			url: 'save',
			data: data,
			success: s,
			dataType: 'json'
		})
		

