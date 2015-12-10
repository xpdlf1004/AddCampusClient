// Copyright (C) 2015 AddCampus, Inc. All rights reserved.

'use strict';

// Has dependency to [ jquery, crypto-js ].
var RequestHelper = (function() {
  return {
    post: post
  }

  function getSignature(query, accessKey) {
    return CryptoJS.HmacSHA1(unescape(query), accessKey).toString();
  }

	function post(url, data, options, successCallback, failCallback) {
    var ajaxOption = {
      url: url,
      method: "POST",
      dataType: "JSON",
      data: JSON.stringify(data),
      contentType: "application/json; charset=UTF-8",
      headers: {}
    }

    if (options.sessionKey) {
      var jsonData = JSON.parse(ajaxOption.data);
      jsonData.session = options.sessionKey;
      ajaxOption.data = JSON.stringify(jsonData);
    }

    if (options.accessKey) {
      ajaxOption.headers.signature = getSignature(ajaxOption.data, options.accessKey);
    }

    $.ajax(ajaxOption).success(function(data) {
      successCallback(data);
    }).fail(function(data) {
      failCallback(data);
    });
  }
})();