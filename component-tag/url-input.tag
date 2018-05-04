<url-input>
	<div each={url in urls} class="mdl-cell mdl-cell--12-col">
		<form action="#" ref="inputArea{url.title}" onsubmit={ submit }>
			<div class="mdl-textfield mdl-textfield--full-width mdl-js-textfield mdl-textfield--floating-label">
				<input ref="inputValue{url.title}" class="mdl-textfield__input" type="text" id="sample3">
				<label class="mdl-textfield__label" for="sample3">To {url.title}</label>
			</div>
		</form>
	</div>


<script >
this.urls = converter.urls;

submit(e) {
	var targetURL = e.item.url;
	var value = this.refs['inputValue'+targetURL.title].value;
	var data = {
		targetText : targetURL.targetText,
		convertURL : targetURL.convertURL,
		inputtedURL : value
	}
	var event = new CustomEvent(converter.EventType.INPUTTED, {'detail' : data});
	document.body.dispatchEvent(event);

}

</script>

</url-input>