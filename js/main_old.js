var menuList;
var categoryList;
var itemList;
var waiterId, tableId, settings, ads;
var baseUrl = 'http://10.0.2.2/mushfiqur/restaurant/';

var makeActive = 0;

$(document).ready(function(){

	/*if( window.javascriptIF.networkStatus() ){
		showToast("network found");
	}else{
		showToast("Network not found");
	}*/
	
	$("#btnLogin").click(function(e){
		e.preventDefault();
		
		if($.trim($("#tblId").val())=='' || $("#waiterPw").val()==''){
			showToast("Table Id or Waiter Password can't be left empty!");			
		}else{
			var loginData = new Object();
			tableId = loginData.tableId = $.trim($("#tblId").val());
			loginData.waiterPw = $("#waiterPw").val();
			
			window.javascriptIF.showMenu(JSON.stringify(loginData), 'login');
			//window.javascriptIF.showMenu();
		}
		return false;
	});
	
	window.allItems = function(receivedDetails){
		$("#loginDiv").hide();
		$("#categoryContainerDiv").show();
		
		menuList = categoryList = itemList = '';
		
		$.each(receivedDetails, function(i,v){
			if(i== 'waiter_id'){
					waiterId = v;
			}else if(i== 'menus'){
				$.each(v, function(menuInd, menuVal){
					
					$.each(menuVal, function(ind, val){
						if( ind=='Menu' ){
							updateMenuList(val);
							updateCategoryList(val, menuVal['Category']);
						}
					});
				});
			}else if(i=='ads'){
				alert('ads will be shown');
				ads = v;
			}else if( i=='settings' ){
				settings = v;
				//showSettings();
			}
		});
	}
	
	function updateMenuList(menuData){
		if( makeActive==0 ){
			$("#menuUl").append('<li class="btn-block btn-text active" style="text-align:left;'+
				'font-color:#94dc49; margin:0;height:40px;" id="'+ menuData['title'] +'">'+
				'<a href="#'+ menuData['title'] +'" data-toggle="tab" style="border-color:#FFFFFF">'+
				'<img src="img/rd.png" class="img-rounded">'+ menuData['title'] +'</a></li>');
		}else{
			$("#menuUl").append('<li class="btn-block btn-text" style="text-align:left;'+
				'font-color:#94dc49; margin:0;height:40px;" id="'+ menuData['title'] +'">'+
				'<a href="#'+ menuData['title'] +'" data-toggle="tab" style="border-color:#FFFFFF">'+
				'<img src="img/rd.png" class="img-rounded">'+ menuData['title'] +'</a></li>');
		} 
	}
	
	/**
	 *
	 */
	function updateCategoryList(menuTitle, categoryData){
		if( makeActive==0 ){
			var cats = '<div class="pull-left tab-pane active" id="'+ menuTitle +'" style="background-color:#dcfcfc;">';
			makeActive = 1;
		}else{
			var cats = '<div class="pull-left tab-pane" id="'+ menuTitle +'" style="background-color:#dcfcfc;">';
		}
		
		//now adding all the categories
		
		$.each(categoryData, function(i, v){
		alert(i);
		alert(v);
			cats += '<div class="pull-left span4" style="height:80px;margin:5px;border:2px solid #ccc;background-color:#fff; border-radius:5px;">'+
					'<img src="'+ baseUrl + 'uploads/thumb/'+ v['thumb_img'] + '" style="height:70px; width:70px; margin:2px;">'+
					'<div class="pull-left span2">'+
						'<h4 style="line-height:15px; margin:1px;">'+ v['title'] +'</h4>'+
						'<div class=" span2" style="height:30px;line-height: 15px; margin:2px;">'+
							'<small style="line-height: 10px;">'+ v['descr'] +'</small>'+
						'</div>'+
					'</div>'+
					'<div class="pull-right">'+
						'<p class="text-right bg-success" style="background-color: #5BB75B; border-radius: 2px;">'+
							'<a href="#launch" data-toggle="modal"> 5 Items </a></p>'+
					'</div>'+
				'</div>';		
		});
		cats += '</div>';
		$("#categorySection").append(cats);
	}
	
	
	$("#Starter").click(function(){
	alert('clicked');
	});
	
	
	function showToast(message){
		window.javascriptIF.showToast(message);
	}
});