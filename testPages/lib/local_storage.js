// Copyright (C) 2015 AddCampus, Inc. All rights reserved.

'use strict';

var LocalStorage = (function () {
	return {
    get: get,
    put: put,
    clear: clear
  }

  function setCookie(key, value, expire) {
    document.cookie = key + "=" + value + "; "

    if (expire) {
      var currentTime = new Date();
      currentTime.setTime(currentTime.getTime() + expire);
      var expires = "expires=" + currentTime.toUTCString();
      document.cookie = document.cookie + expires;
    }
  }

  function getCookie(key) {
    var name = key + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  }

  function deleteCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  function put(key, value, expire) {
    if (typeof(Storage) !== "undefined") {
      localStorage[key] = value;
    } else {
      setCookie(key, value, expire);
    }
  }

  function get(key) {
    if (typeof(Storage) !== "undefined") {
      return localStorage[key]
    } else {
      return getCookie(key);
    }
  }

  function clear(key) {
    if (typeof(Storage) !== "undefined") {
      localStorage.removeItem(key);
    } else {
      deleteCookie(key);
    }
  }
})();
