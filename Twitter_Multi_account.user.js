// ==UserScript==
// @name       Twitter Multi account
// @namespace  twitterma
// @version    0.1
// @description  Enable multi account on Twitter web
// @match      *twitter.com*
// @copyright  2012+, You
// ==/UserScript==

//Array des login de l'user. Vous devez les modifier, et vous pouvez en ajouter autant que vous le voulez
var user = new Array();

user[0] = new Array();
user[0]['username'] = '*****';
user[0]['pass'] = '******';

user[1] = new Array();
user[1]['username'] = '******';
user[1]['pass'] = '*******';

//Fonction de récupération de cookie
function getCookie(sName) {
    var oRegex = new RegExp("(?:; )?" + sName + "=([^;]*);?");

    if (oRegex.test(document.cookie)) {
            return decodeURIComponent(RegExp["$1"]);
    } else {
            return null;
    }
}

//Fonction sauvegarde cookie
function setCookie(sName, sValue) {
        var today = new Date(), expires = new Date();
        expires.setTime(today.getTime() + (365*24*60*60*1000));
        document.cookie = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString() + ";path=/";
}

/*Fonction de déconnexion
i : indice correspondant de l'user dans l'array
*/
function logout(i){
    var logout = document.getElementById("signout-form");
    
    logout.submit(); //On déclenche la déconnexion
    
    setCookie('changeAccount', i); //On définit l'user qui devra se connecter
}

if(/[0-9]+/.test(getCookie('changeAccount'))){ //Si un cookie de changement de compte existe
    if (/logged_out=1/.test(window.location)){ //On vérifit qu'on est sur la page de connexion
        var i = 0;
        var form_length = document.getElementsByTagName("form").length;
        for(i=0;i<form_length;i++){
            if(document.getElementsByTagName("form")[i].className == "js-signin signin") var form = document.getElementsByTagName("form")[i];
        }
        
        //On remplit le formulaire
        form.getElementsByTagName("input")[0].value=user[getCookie('changeAccount')]['username'];
        form.getElementsByTagName("input")[1].value=user[getCookie('changeAccount')]['pass'];
        
        //On supprime le cookie et on se connecte
        setCookie('changeAccount', '');
        form.submit();
    }
}
else{ //Page membre
    var menu = document.getElementById("signout-form").parentNode.parentNode; //Menu déroulant
    menu.innerHTML = menu.innerHTML+"<li class=\"dropdown-divider\"></li>"; //On ajoute un séparateur

    for(var i = 0;i<user.length;i++){ //On boucle les utilisateurs
        //On ajoute un li
        button = document.createElement("li");
        button.id = "changeAccount"+i;
        button.innerHTML = "<a href=\"#\" id=\"changeAccount"+i+"\" data-nav=\"settings\" class=\"js-nav\">"+user[i]['username']+"</a>"; //Peut contenir de l'html
        menu.appendChild(button);

        button.addEventListener('click',function(){logout(this.id.substr(13));},true); //On attache l'évènement au bouton
        
    }
}
