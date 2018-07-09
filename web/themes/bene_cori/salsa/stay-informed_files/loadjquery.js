var jqVersion = "1.3.2";
var versionMatch = false;
try{
	//If s$ is loaded we should not overload...we might loose plugins.
	if("undefined" != typeof(s$))
	{
		versionMatch = true;
	}
	else
	{
		var loadedJquery = $;
		versionMatch = ("undefined" != typeof(loadedJquery) && loadedJquery().jquery==jqVersion)
		if(versionMatch)
			s$ = $;
	}
}catch(exc){
}
if(!versionMatch){
    jqURL = "/salsa/include/jquery-"+jqVersion+".min.js";
    var jqLoader = null
    if (window.XMLHttpRequest){
        jqLoader = new XMLHttpRequest();
    } else {
        jqLoader = new ActiveXObject("Microsoft.XMLHTTP"); //argh!!
    }
    jqLoader.open("GET",jqURL,false);//synchronous
    jqLoader.send(null);

    var browser=navigator.userAgent.toLowerCase();
    if (browser.indexOf("mozilla") == -1 && browser.indexOf("msie") == -1 && browser.indexOf("opera") == -1)//bah, safari and chrome don't like inserting javascript
    {
        eval(jqLoader.responseText);
    } else {//try to avoid using eval for browsers where DOM injection works
        var documentHead = document.getElementsByTagName("head");
        if (documentHead.length==0){
            documentHead = document;
        } else {
            documentHead = documentHead[0];
        }
        var jq = document.createElement("script");
        jq.type = "text/javascript";
        jq.id = "jq";

        jq.text = jqLoader.responseText;//seems to work in FF, IE and Opera
        documentHead.appendChild(jq);
    }
    if("undefined" == typeof(jQuery)){
        throw("jQuery loader: failed to load jquery. Maybe a browser compatibility issue");
    };

	//Alias our version of jquery so we keep it in case of overrides
	if(typeof s$ == 'undefined' || s$().jquery!=jqVersion)
		s$ = $;
}

//Alias our version of jquery so we keep it in case of overrides
if(typeof s$ == 'undefined' || s$().jquery!=jqVersion)
	s$ = $;
