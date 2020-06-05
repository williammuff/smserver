var items = "";
var shown_name = "";
var texts = "";
var image_string = "";
const readJson = async () => {
    let url = "/requests?c"
    const fetch_val = await fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(json => {
        this.items = (json.chats)
        return items
    })
    .catch(function () {
        this.dataError = true;
    })
}

const printItems = async () => {
    var new_items = await readJson();
    const num_texts = 500;
    var doc = document.getElementsByClassName("chats-list")[0];

    for(var i = 0; i < items.length; i++) {
        
        var b = document.createElement('button');
        b.setAttribute("id", items[i].chat_identifier);

        b.innerHTML = "<img src=\"data:image/png;base64," + items[i].image_text + "\">";

        if (items[i].display_name.length === 0) {
            b.innerHTML += "<p>" + items[i].chat_identifier + "</p>";
        } else {
            b.innerHTML += "<p>" + items[i].display_name + "</p>";
        }
        var get_texts_string = "getTexts(\"" + items[i].chat_identifier + "\", " + num_texts + ")";
        b.setAttribute("onclick", get_texts_string);
        
        doc.appendChild(b);
    }
}

const fetchName = async (name) => {
    var url = '/requests?n=' + name
    var return_name = ""
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            return xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", url, false );
    xmlhttp.send(); 
    this.shown_name = xmlhttp.responseText;
    return String(return_name)
}

const getTexts = async (chat_id, num_texts) => {
    var myNode = document.getElementsByClassName("text-content")[0];
    myNode.innerHTML = '';

    let url = "/requests?p=" + chat_id + "&n=" + num_texts
    const fetch_texts = await fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(json => {
        this.texts = (json.texts)
        return texts
    })
    .catch(function () {
        this.dataError = true;
    })

    var chat_title = document.getElementById(chat_id)
    var title_doc = document.getElementsByClassName("title")[0]
    title_doc.innerHTML = chat_title.innerHTML
    title_doc.setAttribute("id", chat_id);

    var _ = await fetch_texts

    for (var i = 0; i < texts.length; i++) {
        var doc = document.getElementsByClassName("text-content")[0]
        var t = document.createElement("p");

        if (i == 0) {
            t.setAttribute("id", "more_texts");
        }
        
        var classes = "text";
        if (texts[i].is_from_me === "0") {
            classes += " is_from_them";
            t.setAttribute("class", classes);
        } else {
            classes += " is_from_me";
            t.setAttribute("class", classes);
        }
        t.innerHTML = texts[i].text;
        /// So uh do (date/384196335.3) == unix timestamp. About. The number is somewhere around there. 
        if (i != 0 && texts[i].date - texts[i - 1].date > 2800000000000) {
            var time = document.createElement("p");
            time.setAttribute("class", "time-display");

            let unix_timestamp = texts[i].date / 384196335.3 ///This is just what the number seems to be, for the apple text database? It's not exact and is in fact very wrong

            function timeConverter(UNIX_timestamp){
                var a = new Date(UNIX_timestamp * 1000);
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var year = a.getFullYear();
                var month = months[a.getMonth()];
                var date = a.getDate();
                var hour = a.getHours();
                var min = a.getMinutes();
                var time = date + ' ' + month + ' ' + year + ' ' + (hour < 10 ? '0' : '') + hour + ':' + (min < 10 ? '0' : '') + min;
                return time;
            }

            var formattedTime = timeConverter(unix_timestamp)
            
            time.innerHTML = formattedTime
            doc.appendChild(time)
        }
        
        doc.appendChild(t);
        doc.appendChild(document.createElement("br"));
        if (texts[i].is_from_me != texts[i + 1].is_from_me) {
            doc.appendChild(document.createElement("br")); 
        }
        t.focus();
        var elem = document.getElementById('text-content');
        elem.scrollTop = elem.scrollHeight;
    } ///Right now this scrolls to right before the very end of the document; Gotta fix that.
}

const getImage = async (chat_id) => {
    var url = '/requests?i=' + chat_id
    const fetch_image = await fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.text();
    })
    .then(text => {
        this.image_string = text
        return image_string
    })
    .catch(function () {
        this.dataError = true;
    })
}

function sendText() {
    body = document.getElementById("sendbox").value
    recipient = document.getElementsByClassName("title")[0].id
    
    var url = '/requests?s=' + body + "&t=" + recipient
    const fetch_image = fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
    })
    .catch(function () {
        this.dataError = true;
    })
    
    document.getElementById("sendbox").value = "";
    
    var doc = document.getElementsByClassName("text-content")[0];
    var t = document.createElement("p");
    t.setAttribute("class", "text is_from_me");
    t.innerHTML = body;
    
    doc.appendChild(t);
    doc.appendChild(document.createElement("br"));
    
    t.focus();
    var elem = document.getElementById('text-content');
    elem.scrollTop = elem.scrollHeight;
}

printItems()

$('#more_texts').scroll(function() {
    if ( $(this)[0].scrollHeight - $(this).scrollTop() <= $(this).outerHeight()) {
        alert('yu[p scroll works')
    }
})

function auto_grow(element) {
    element.style.height = "max-content";
    element.style.height = (element.scrollHeight - 2)+"px";
}