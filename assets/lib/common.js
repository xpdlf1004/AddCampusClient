	$(document).ready(function(){

		if (LocalStorage.get('sessionKey') == undefined) {
			$("#header_right_out").css("display", "inline-block");
			$("#header_right_in").css("display", "none");
		} else {
			$("#header_right_out").css("display", "none");
			$("#header_right_in").css("display", "inline-block");
		}
		
		$("#sign_in").submit(submitLoginForm);
		
		$("#tab_sign_out").click(logout);
		
		$("#tab_sign_in").click(function(){
			layer_open('layer2');
			return false;
		});
		
		$.fn.raty.defaults.path = '/assets/lib/rate/images';
		
		$("#averageGrade").raty();
		$("#facilitiesGrade").raty();
		$("#cultureGrade").raty();
		$("#townGrade").raty();
		$("#tuitionGrade").raty();
		$("#professorGrade").raty();
    	
    	$("#sign_up").submit(submitForm);
    	$("#writeMajorReview").submit(writeMajorReview);

		$("#review_write_next_1").click(function(){

			$("#review_write_1").hide();
			$("#review_write_2").show();
			return false;

		});

		$("#review_write_back_1").click(function(){

			$('.layer2s').fadeOut();
			return false;

		});

		$("#review_write_back_2").click(function(){

			$("#review_write_1").show();
			$("#review_write_2").hide();
			return false;

		});

		$("#sign_b_s").click(function(){

			$("#sign_in_table").hide();
			$("#sign_up_table_1").show();
			return false;

		});

		$("#sign_back_1").click(function(){

			$("#sign_in_table").show();
			$("#sign_up_table_1").hide();
			return false;

		});

		$("#sign_next_1").click(function(){

			if ($('#sign_up_email').val() == '') {
				alert("아이디를 정확하게 입력해주세요");
				return false;
			}

			if ($('#sign_up_pw').val() == '') {
				alert("비밀번호를 정확하게 입력해주세요");
				return false;
			}

			if ($('#sign_up_pw_').val() == '') {
				alert("비밀번호를 정확하게 입력해주세요");
				return false;
			}

			if ($('#sign_up_pw').val() != $('#sign_up_pw_').val()) {
				alert("입력한 두 비밀번호가 다릅니다");
				return false;
			}

			$("#sign_in_table").hide();
			$("#sign_up_table_1").hide();
			$("#sign_up_table_2").show();
			return false;

		});

		$("#sign_back_2").click(function(){

			$("#sign_in_table").hide();
			$("#sign_up_table_1").show();
			$("#sign_up_table_2").hide();
			$("#sign_up_table_3").hide();
			return false;

		});

		$("#sign_next_2").click(function(){

			$("#sign_in_table").hide();
			$("#sign_up_table_1").hide();
			$("#sign_up_table_2").hide();
			$("#sign_up_table_3").show();
			return false;

		});

		$("#sign_back_3").click(function(){

			$("#sign_in_table").show();
			$("#sign_up_table_1").hide();
			$("#sign_up_table_2").hide();
			$("#sign_up_table_3").hide();

			$('.layer').fadeOut();
			return false;

		});

		for (var year = 2015; year >= 1901; year--) {
			$("#birthYear").append("<option value='" + year + "'>" + year + "</option>");	
		}

		/******************************************
		* 학교 리뷰 작성: 학교 검색 -> 학과 정보 가져오기 
		/*****************************************/
		availableTagsCollege = [];

		RequestHelper.post('/college/getAllColleges', {},
		{
		// Option is not needed.
		}, function(data) {
			var length = data.result[0].colleges.length;

			for (var i = 0; i<length; i++) {
				availableTagsCollege[i] = data.result[0].colleges[i].collegeName;
			}

		}, function(data) {
			alert(JSON.stringify(data));
		});

		$("#collegeName").autocomplete({
			source: availableTagsCollege
		});

		$("#collegeName").keyup(function(){
			getMajor($("#collegeName").val());
		});

	})
	/************************/

	/*************************
	* For Sign
	*************************/
	function submitForm(event) {
		event.preventDefault();
		var email = $('#sign_up_email').val();
		var pw = $('#sign_up_pw').val();
		var isGenderManChecked = $('#gender_man').is(':checked');
		var gender = isGenderManChecked ? 'man' : 'woman';
		var birthYear = parseInt($('#birthYear').val(), 10);
		var job = $('#job').val();

		RequestHelper.post('/account/makeUserAccount', {
			email: email,
			password: pw,
			gender: gender,
			birthYear: birthYear,
			job: job
		}, {
		// Option is not needed.
		}, function(data) {
			$('#sign_up_email_').text(email);

			alert(JSON.stringify(data));
			alert("회원가입에 성공했습니다.");
		}, function(data) {
			alert(JSON.stringify(data));
			alert("회원가입에 실패했습니다, 다시 시도해주세요.");

			location.href='/';
		});
	}

	function submitLoginForm(event) {
		event.preventDefault();
		
		var email = $('#sign_id').val();
		var pw = $('#sign_pw').val();

		if (email == '') {
			alert("이메일을 입력해주세요.");
			return false;
		}

		if (pw == '') {
			alert("로그인에 실패했습니다.");
			return false;
		}

		RequestHelper.post('/account/loginWithEmail', {
			email: email,
			password: pw
		}, {
			// Option is not needed.
		}, function(data) {
			alert(JSON.stringify(data));

			if (data.result[0].status == 'ok') {
				location.href = '/';
			} else {
				location.href = '/';
			}

			LocalStorage.put('sessionKey', data.result[0].sessionKey);
			LocalStorage.put('accessKey', data.result[0].accessKey);
			LocalStorage.put('accountSequence', data.result[0].accountSequence);
		}, function(data) {
			alert(JSON.stringify(data));
		});
	}

	function logout(event) {
		event.preventDefault();
		var accountSequence = LocalStorage.get('accountSequence');

		RequestHelper.post('/account/logoutUserAccount', {
			accountSequence: accountSequence
		}, {
			sessionKey: LocalStorage.get('sessionKey'),
			accessKey: LocalStorage.get('accessKey')
		}, function(data) {
			alert(JSON.stringify(data));
			LocalStorage.clear('sessionKey');
			LocalStorage.clear('accessKey');
			LocalStorage.clear('accountSequence');

			location.href = '/';
		}, function(data) {
			alert(JSON.stringify(data));
		});
	}

	function layer_open(el){

		var temp = $('#' + el);
		var bg = temp.prev().hasClass('bg');
		//dimmed 레이어를 감지하기 위한 boolean 변수

		if(bg){
			$('.layer').fadeIn();
			//'bg' 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다. 
		}else{
			temp.fadeIn();
		}

		// 화면의 중앙에 레이어를 띄운다.
		if (temp.outerHeight() < $(document).height() ) temp.css('margin-top', '-'+temp.outerHeight()/2+'px');
		else temp.css('top', '0px');
		if (true ) temp.css('margin-left', '-'+temp.outerWidth()/2+'px');
		// if (temp.outerWidth() < $(document).width() ) temp.css('margin-left', '-'+temp.outerWidth()/2+'px');
		// else temp.css('left', '0px');

		temp.find('a.cbtn').click(function(e){
			if(bg){
				$('.layer').fadeOut(); 
				//'bg' 클래스가 존재하면 레이어를 사라지게 한다. 
			}else{
				temp.fadeOut();
			}
			e.preventDefault();
		});

		$('.layer .bg').click(function(e){	
		//배경을 클릭하면 레이어를 사라지게 하는 이벤트 핸들러
			$('.layer').fadeOut();
			e.preventDefault();
		});

	}

	function layer_open2(el){

		if (LocalStorage.get('sessionKey') == undefined) {

			alert("애드캠퍼스 로그인 후 이용 가능합니다.");
			
			layer_open('layer2');
			return false;

		} else {

			var temp = $('#' + el);
			var bg = temp.prev().hasClass('bg2');
			//dimmed 레이어를 감지하기 위한 boolean 변수

			if(bg){
				$('.layer2s').fadeIn();
				//'bg' 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다. 
			}else{
				temp.fadeIn();
			}

			// 화면의 중앙에 레이어를 띄운다.
			if (temp.outerHeight() < $(document).height() ) temp.css('margin-top', '-'+temp.outerHeight()/2+'px');
			else temp.css('top', '0px');
			if (true ) temp.css('margin-left', '-'+temp.outerWidth()/2+'px');
			// if (temp.outerWidth() < $(document).width() ) temp.css('margin-left', '-'+temp.outerWidth()/2+'px');
			// else temp.css('left', '0px');

			temp.find('a.cbtn').click(function(e){
				if(bg){
					$('.layer2s').fadeOut(); 
					//'bg' 클래스가 존재하면 레이어를 사라지게 한다. 
				}else{
					temp.fadeOut();
				}
				e.preventDefault();
			});

			$('.layer2s .bg2').click(function(e){	
			//배경을 클릭하면 레이어를 사라지게 하는 이벤트 핸들러

				$('.layer2s').fadeOut();
				e.preventDefault();
			});

		}

	}

	function layer_open3(){

		var temp = $("#popup_soon");
		var bg = temp.prev().hasClass('bg2');
		//dimmed 레이어를 감지하기 위한 boolean 변수

		if(bg){
			$('.layer3s').fadeIn();
			//'bg' 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다. 
		}else{
			temp.fadeIn();
		}

		// 화면의 중앙에 레이어를 띄운다.
		if (temp.outerHeight() < $(document).height() ) temp.css('margin-top', '-'+temp.outerHeight()/2+'px');
		else temp.css('top', '0px');
		if (true ) temp.css('margin-left', '-'+temp.outerWidth()/2+'px');
		// if (temp.outerWidth() < $(document).width() ) temp.css('margin-left', '-'+temp.outerWidth()/2+'px');
		// else temp.css('left', '0px');

		temp.find('a.cbtn').click(function(e){
			if(bg){
				$('.layer3s').fadeOut(); 
				//'bg' 클래스가 존재하면 레이어를 사라지게 한다. 
			}else{
				temp.fadeOut();
			}
			e.preventDefault();
		});

		$('.layer3s .bg2').click(function(e){	
		//배경을 클릭하면 레이어를 사라지게 하는 이벤트 핸들러

			$('.layer3s').fadeOut();
			e.preventDefault();
		});

		$('.layer3s button').click(function(e){	
		//배경을 클릭하면 레이어를 사라지게 하는 이벤트 핸들러

			$('.layer3s').fadeOut();
			e.preventDefault();
		});

	}

	$(".soon").click(function(){
		layer_open3();
	});
	
	/******************************************
	* 리뷰 작성
	/*****************************************/
	function writeMajorReview(event) {
		event.preventDefault();
		var accountSequence = LocalStorage.get('accountSequence');
		var oneLineComment = $('#oneLineComment').val();
		var advantageComment = $('#advantageComment').val();
		var weaknessComment = $('#weaknessComment').val();
		var wishComment = $('#wishComment').val();
		var isRecommended = $("input[name=isRecommended]:checked").val()
		var viewAfter3Years = $("input[name=viewAfter3Years]:checked").val()
		var averageGrade = $("#averageGrade").raty('score');
		var facilitiesGrade = $("#facilitiesGrade").raty('score');
		var cultureGrade = $("#cultureGrade").raty('score');
		var townGrade = $("#townGrade").raty('score');
		var tuitionGrade = $("#tuitionGrade").raty('score');
		var professorGrade = $("#professorGrade").raty('score');

		var collegeID = retCollegeID;
		var majorID = $("#getMajor2").val();

		RequestHelper.post('/college/writeMajorReview', {
			accountSequence: accountSequence,
			oneLineComment: oneLineComment,
			advantageComment: advantageComment,
			weaknessComment: weaknessComment,
			wishComment: wishComment,
			isRecommended: isRecommended,
			viewAfter3Years: viewAfter3Years,
			collegeID: collegeID,
			majorID: majorID,
			averageGrade: averageGrade,
			facilitiesGrade: facilitiesGrade,
			cultureGrade: cultureGrade,
			townGrade: townGrade,
			tuitionGrade: tuitionGrade,
			professorGrade: professorGrade
			
		}, {
			sessionKey: LocalStorage.get('sessionKey'),
			accessKey: LocalStorage.get('accessKey')
		}, function(data) {
			alert(JSON.stringify(data));
		}, function(data) {
			alert(JSON.stringify(data));
		});
	}

	/******************************************
	* 학교 입력 후 해당 학과 정보 가져오기
	/*****************************************/
	retCollegeID = '';

	function getMajor(ofName) {

		RequestHelper.post('/college/getAllColleges', {},
		{
		// Option is not needed.
		}, function(data) {
			var length = data.result[0].colleges.length;

			for (var i = 0; i<length; i++) {
				if (data.result[0].colleges[i].collegeName == ofName) {
					retCollegeID = data.result[0].colleges[i].collegeID;

					RequestHelper.post('/college/getAllMajorsInCollege', {
						collegeID: retCollegeID
					},
					{
					// Option is not needed.
					}, function(data) {
						// 리스트 추가
						var majors = data.result[0].majors;
						var groupList = $('#getMajor1');
						var majorsList = $('#getMajor2');

						for (var i in majors) {
							var optionStr1 = '<option value="' + majors[i].majorID + '">' + majors[i].majorClass + '</option>';
							var optionStr2 = '<option value="' + majors[i].majorID + '">' + majors[i].majorName + '</option>';
							$(optionStr1).appendTo(groupList);
							$(optionStr2).appendTo(majorsList);
						}

					}, function(data) {
						alert("잘못된 접근입니다, 뒤로가기 이동");
					});

				} else {
					$("select[name='mypage_form'] option").remove();
				}
			}

		}, function(data) {
			alert(JSON.stringify(data));
		});
	}
	/*****************************************/

  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      testAPI();
    } else if (response.status === 'not_authorized') {
      document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    } else {
      document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    }
  }

  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1513892868907796',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2' // use version 2.2
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }