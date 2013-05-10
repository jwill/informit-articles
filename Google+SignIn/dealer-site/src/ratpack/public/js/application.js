// Some general UI pack related JS
/*
$(function () {
    // Custom selects
    $("select").dropkick();
});


// Todo list
$(".todo li").click(function () {
    $(this).toggleClass("todo-done");
});

// Init tooltips
$("[data-toggle=tooltip]").tooltip("show");

// Init tags input
$("#tagsinput").tagsInput();

// Init jQuery UI slider
$("#slider").slider({
    min: 1,
    max: 5,
    value: 2,
    orientation: "horizontal",
    range: "min",
});

// JS input/textarea placeholder
$("input, textarea").placeholder();

// Make pagination demo work
$(".pagination a").click(function () {
    if (!$(this).parent().hasClass("previous") && !$(this).parent().hasClass("next")) {
        $(this).parent().siblings("li").removeClass("active");
        $(this).parent().addClass("active");
    }
});

$(".btn-group a").click(function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
});

// Disable link click not scroll top
$("a[href='#']").click(function () {
    return false
});*/

// Signin callback - client side
function signinCallback(result) {
    if (result['access_token']) {
        document.querySelector('#signinButton').setAttribute('style', 'display:none');
        //document.querySelector('#logout').setAttribute('style', 'display:block');
        loadProfileInfo();
    } else if (result['error']) {
       console.log(result);
    }
}

function makeComment() {
  var commentText = "This is a comment."; //document.querySelector("#commentText").innerText;
  var authorName = localStorage['name'];
  var imageUrl = localStorage['imageUrl'];
  
  var url = 'http://0.0.0.0:5050/comment';
  
  var data = "";
  data += 'authorName='+ authorName+'&';
  data += 'imageUrl='+ imageUrl+'&';
  data += 'commentText='+ commentText;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.onload = function(response) {
    if (this.status == 200) {
      // Create comment was successful
      // Create activity on Google+
      makeCommentActivity(this.reponseText, commentText);
    }
  };
  xhr.send(data)
}

function revokeConnection() {
    var access_token = gapi.auth.getToken().access_token;
    var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + access_token;
    try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onload = function(response) {
       if (this.status == 200) {
           // success
           console.log("User disconnected");
       }
    }
    xhr.send();
    } catch (error) {
        window.location = 'https://plus.google.com/apps';
        console.log("error");
    } finally {
        localStorage.removeItem('name');
        localStorage.removeItem('imageUrl')
    }
}

function loadProfileInfo() {
    var request = gapi.client.request({
        path: '/plus/v1/people/me',
        method: 'GET'
    });
    var callback = function (result) {
        localStorage['name'] = result.displayName;
        localStorage['imageUrl'] = result.image.url;

        var name = document.createElement('span');
        name.innerText = 'Signed in as '+ result.displayName+"  ";
        var image = new Image();
        image.onload = function() {
            var status = document.querySelector("#status");
            status.appendChild(name);
            status.appendChild(image);
        };
        image.src = result.image.url;
    };
    request.execute(callback);
}

function makeCommentActivity(id, commentText) {
    console.log("in make comment activity");
    var body = {
        'type':'http://schemas.google.com/CommentActivity',
        'target':{
            'url':'http://0.0.0.0:5050/index.html#'+id
        },
        'result':{
            'type': 'http://schema.org/Comment',
            'url': 'http://0.0.0.0:5050/index.html#'+id,
            'name': localStorage['authorName'],
            'text': commentText
        }
    };
    var request = gapi.client.request({
        path:'/plus/v1/people/me/moments/vault',
        method:'POST',
        debug: false,
        body:body
    });

    var callback = function (result) {
        console.log(result);
    };

    request.execute(callback);
}

