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
		
		$("#tab_sign_in, .f_sign").click(function(){
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

			if (retCollegeID) {

				$(".help_write_1").hide();
				$(".help_write_2").show();
				$("#review_write_1").hide();
				$("#review_write_2").show();

				$(".SearchCollegeMajor").html($("#SearchcollegeName").val() + " " + $("#getMajor2 option:selected").text());
				$(".SearchCollegeLogo").attr('src', '/assets/img/logo/logo_' + retCollegeID + '.jpg');

			} else {

				alert("리뷰를 작성하려고 하는 대학교를 먼저 선택해주세요.");

			}

			return false;

		});

		$("#review_write_back_1").click(function(){

			$('.layer2s').fadeOut();
			return false;

		});

		$("#review_write_back_2").click(function(){

			$("#review_write_1").show();
			$("#review_write_2").hide();
			
			$(".help_write_1").show();
			$(".help_write_2").hide();

			$('#oneLineComment').val("");
			$('#advantageComment').val("");
			$('#weaknessComment').val("");
			$('#wishComment').val("");
			$("input[name=isRecommended]:checked").val("");
			$("input[name=viewAfter3Years]:checked").val("");
			$("#averageGrade").val("");
			$("#facilitiesGrade").val("");
			$("#cultureGrade").val("");
			$("#townGrade").val("");
			$("#tuitionGrade").val("");
			$("#professorGrade").val("");

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

			RequestHelper.post('/account/checkEmail', {
				email: $('#sign_up_email').val()
			}, {
			// Option is not needed.
			}, function(data) {

				if (data.status == "ok") {

					$("#sign_in_table").hide();
					$("#sign_up_table_1").hide();
					$("#sign_up_table_2").show();

				} else if (data.status == "DuplicatedEmail") {

					alert("이미 사용 중인 이메일 입니다!");
					return false;

				}

			}, function(data) {

				alert("이메일이 잘못되었거나 사용할 수 없는 이메일 입니다.");
				return false;
			});

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

			var inputEmail = $("#sign_up_email").val();

			$("#sign_up_email_").text(inputEmail);

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

		$("#SearchcollegeName").autocomplete({
			source: availableTagsCollege
		});

		$("#SearchcollegeName").keyup(function(){
			getMajor($("#SearchcollegeName").val());
		});

		$('#getMajor1').change(function(){

			$("#getMajor2").find("option").remove();

			for (var i in majorsNameLists) {
				if (majorsNameLists[i].indexOf($("#getMajor1 option:selected").val()) != -1) {
					var className = majorsNameLists[i].split("/");
					$('#getMajor2').append("<option value='" + className[2] + "'>" + className[1] + "</option>");
				}
			}

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
		var birthYear = $('#birthYear').val();
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
			alert("회원가입에 성공했습니다.");

			location.href='/';
		}, function(data) {
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
			alert("패스워드를 입력해주세요.");
			return false;
		}

		RequestHelper.post('/account/loginWithEmail', {
			email: email,
			password: pw
		}, {
			// Option is not needed.
		}, function(data) {

			if (data.status == "ok") {
				alert("성공적으로 로그인 되었습니다.");

				LocalStorage.put('sessionKey', data.result[0].sessionKey);
				LocalStorage.put('accessKey', data.result[0].accessKey);
				LocalStorage.put('accountSequence', data.result[0].accountSequence);

				location.href = '/';
			} else {
				alert("로그인에 실패했습니다, 다시 시도해주세요.");
				location.href = '/';
			}
				
		}, function(data) {
			alert(JSON.stringify(data));
		});
	}

	function logout(event) {
		event.preventDefault();
		var accountSequence = LocalStorage.get('accountSequence');

		RequestHelper.post('/account/recommendReview', {
			accountSequence: accountSequence
		}, {
			sessionKey: LocalStorage.get('sessionKey'),
			accessKey: LocalStorage.get('accessKey')
		}, function(data) {
			alert("성공적으로 로그아웃 되었습니다.");
			LocalStorage.clear('sessionKey');
			LocalStorage.clear('accessKey');
			LocalStorage.clear('accountSequence');

			location.href = '/';
		}, function(data) {
			alert("성공적으로 로그아웃 되었습니다.");
			LocalStorage.clear('sessionKey');
			LocalStorage.clear('accessKey');
			LocalStorage.clear('accountSequence');

			location.href = '/';
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

			$("#sign_in_table").show();
			$("#sign_up_table_1").hide();
			$("#sign_up_table_2").hide();
			$("#sign_up_table_3").hide();
			
			$('#sign_back_2').css('display', '');
			$('#sign_next_2').attr('onclick', 'submit');
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

				$('.layer2s').fadeOut();
				e.preventDefault();

				$("#review_write_1").show();
				$("#review_write_2").hide();
				
				$(".help_write_1").show();
				$(".help_write_2").hide();

				$("#SearchcollegeName").val("");
				$("#getMajor1").val("");
				$("#getMajor2").val("");

				retCollegeID = "";
				$(".SearchCollegeMajor").val("");

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
		var isRecommended = $("input[name=isRecommended]:checked").val();
		var viewAfter3Years = $("input[name=viewAfter3Years]:checked").val();
		var averageGrade = $("#averageGrade").raty('score');
		var facilitiesGrade = $("#facilitiesGrade").raty('score');
		var cultureGrade = $("#cultureGrade").raty('score');
		var townGrade = $("#townGrade").raty('score');
		var tuitionGrade = $("#tuitionGrade").raty('score');
		var professorGrade = $("#professorGrade").raty('score');

		isRecommended = new Boolean (isRecommended);

		var collegeID = retCollegeID;
		var majorID = $("#getMajor2").val();

		if ((oneLineComment == '') || (advantageComment == '') || (weaknessComment == '') || (wishComment == '') || (viewAfter3Years == '') || (averageGrade == '') || (facilitiesGrade == '') || (cultureGrade == '') || (townGrade == '') || (tuitionGrade == '') || (professorGrade == '')) {
			alert("모든 내용을 빠짐없이 작성해주셔야 합니다");
			return false;
		}

		if ((String($('#oneLineComment').val()).length <= 20) || (String($('#oneLineComment').val()).length >= 50)) {
			alert("학과 한줄평은 최소 30자, 최대 50자까지 작성해야합니다.");
			return false;
		}

		if ((String($('#advantageComment').val()).length <= 30) || (String($('#advantageComment').val()).length >= 500)) {
			alert("학과의 장점은 최소 30자, 최대 500자까지 작성해야합니다.");
			return false;
		}

		if ((String($('#weaknessComment').val()).length <= 30) || (String($('#weaknessComment').val()).length >= 500)) {
			alert("학과의 단점은 최소 30자, 최대 500자까지 작성해야합니다.");
			return false;
		}

		if ((String($('#wishComment').val()).length <= 20) || (String($('#wishComment').val()).length >= 500)) {
			alert("학과의 바라는점은 최소 30자, 최대 500자까지 작성해야합니다.");
			return false;
		}

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

			if (data.status == 'ok') {
				alert("성공적으로 리뷰가 작성되었습니다, 해당 대학 페이지로 이동됩니다!");
				location.href = '/review/univ/?univ=' + collegeID;
			} else {
				alert("리뷰 작성에 실패했습니다, 다시 작성해주세요!");
			}

		}, function(data) {
			alert(JSON.stringify(data));
		});
	}

	/******************************************
	* 학교 입력 후 해당 학과 정보 가져오기
	/*****************************************/
	retCollegeID = '';
	majorClassList = new Array();
	majorNameList = new Array();
	majorsNameLists = new Array();

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
							majorClassList[i] = majors[i].majorClass;
							majorNameList[i] = majors[i].majorName;
							majorsNameLists[i] = data.result[0].majors[i].majorClass + "/" + data.result[0].majors[i].majorName + "/" + data.result[0].majors[i].majorID;
						}

						// 배열 중복 제거
						majorClassList = $.unique(majorClassList);

						for (var i in majorClassList) {
							$(groupList).append("<option value='" + majorClassList[i] + "'>" + majorClassList[i] + "</option>");
						}

						$("#getMajor2").find("option").remove();

						for (var i in majorsNameLists) {
							if (majorsNameLists[i].indexOf($("#getMajor1 option:selected").val()) != -1) {
								var className = majorsNameLists[i].split("/");
								$('#getMajor2').append("<option value='" + className[2] + "'>" + className[1] + "</option>");
							}
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
		if (response.status === 'connected') {

			if ((response.authResponse.userID === '') || (response.authResponse.accessToken === '')) {
				alert("로그인에 실패했습니다, 다시 시도해주세요!");
				locaion.href = '/';
			} else {
				makeUserAccount(response.authResponse.userID, response.authResponse.accessToken);	
			}
			
		} else if (response.status === 'not_authorized') {
			alert("페이스북에 먼저 로그인 해주세요!");
			window.open("http://facebook.com/", "_blank");
			console.log(response);
		} else {
			alert("페이스북에 먼저 로그인 해주세요!");
			window.open("http://facebook.com/", "_blank");
			console.log(response);
		}
	}

	function makeUserAccount(facebookUserKey, facebookAccessToken) {

		RequestHelper.post('/account/loginWithFacebook', {
			facebookUserKey: facebookUserKey,
			facebookAccessToken: facebookAccessToken
		}, {
		// Option is not needed.
		}, function(data) {

			if (data.status == 'InvalidUserID') {

				$('.sign_up_table_2').css('display', '');
				$('.sign_in_table').css('display', 'none');

				$('#sign_back_2').css('display', 'none');
				$('#sign_next_2').attr('onclick', 'fbSignUp("' + facebookUserKey + '", "' + facebookAccessToken + '");return false;');

			} else if (data.status == 'ok') {

				alert("성공적으로 로그인 되었습니다.");

				LocalStorage.put('sessionKey', data.result[0].sessionKey);
				LocalStorage.put('accessKey', data.result[0].accessKey);
				LocalStorage.put('accountSequence', data.result[0].accountSequence);

				location.href = '/';

			} else {

				alert("잘못된 접근입니다, 다시 시도해주세요!");
				location.href = '/';

			}

		}, function(data) {

			alert("잘못된 접근입니다, 다시 시도해주세요!");
			location.href = '/';

		});
	}
				
	function fbSignUp(facebookUserKey, facebookAccessToken) {

		var isGenderManChecked = $('#gender_man').is(':checked');
		var gender = isGenderManChecked ? 'man' : 'woman';
		var birthYear = $('#birthYear').val();
		var job = $('#job').val();

		$("#sign_up_email_").text('페이스북 회원가입');

		if ((job == '') || (birthYear == '') || (gender == '')) {
			alert("모든 정보를 빠짐없이 작성해주시길 바랍니다.");
			// break;
		}

		RequestHelper.post('/account/makeUserAccountWithFacebook', {
			facebookUserKey: facebookUserKey,
			facebookAccessToken: facebookAccessToken,
			gender: gender,
			birthYear: birthYear,
			job: job
		}, {
		// Option is not needed.
		}, function(data) {

			if (data.status == 'ok') {
				alert("성공적으로 회원가입되었습니다, 다시 로그인해주세요!");
				location.href = '/';
			} else {
				alert("잘못된 접근입니다, 다시 시도해주세요!");
				location.href = '/';
			}

		}, function(data) {
			alert("잘못된 접근입니다, 다시 시도해주세요!");
			location.href = '/';
		});

	}

	function facebookSign() {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '1513892868907796',
			cookie     : true,
			xfbml      : true,
			version    : 'v2.2'
		});
	};

	(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));