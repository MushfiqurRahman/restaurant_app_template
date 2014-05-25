var waiterId, tableId, settings, ads;

//those variables are very important
var baseUrl = 'http://10.0.2.2/mushfiqur/restaurant/';

//simple comments
//var baseUrl = 'http://192.168.43.181/restaurant/api/';
//var baseUrl = 'http://10.0.2.2/mushfiqur/restaurant/';
var baseUrl = 'http://192.168.0.100/2014/restaurant/';

var visible_items_div_id;
var makeActive = 0;
var allItemList = new Array();
var itemsInBucket = new Array();
var totalPrice = 0;
var modalItemId;

$(document).ready(function(){

	/*if( window.javascriptIF.networkStatus() ){
		showToast("network found");
	}else{
		showToast("Network not found");
	}*/
	
	visible_items_div_id = false;
	
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
		
		$.each(receivedDetails, function(i,v){
			if(i== 'waiter_id'){
					waiterId = v;
			}else if(i== 'menus'){
				$.each(v, function(menuInd, menuVal){
					
					$.each(menuVal, function(ind, val){
						if( ind=='Menu' ){
							addMenuList(val);
							addCategoryList(val['title'], menuVal['Category']);
						}
					});
				});
			}else if(i=='ads'){				
				ads = v;
			}else if( i=='settings' ){
				settings = v;
				//showSettings();
			}
		});
	}
	
	window.orderResponse = function(response){
		if( response.success==true){
			initializeVariables();
		}
	}
	
	//Initialization to take order again
	function initializeVariables(){
		itemsInBucket = new Array();
		totalPrice = 0;
		update_total_price('0');
		$("#bucketDiv").html('');
	}
	
	//Show all the Menus
	function addMenuList(menuData){
		//since some menu title may have ' ' in between them
		var menuId = menuData['title'].replace(/\s/g, '-');
		
		if( makeActive==0 ){
			$("#menuUl").append('<li class="active btn-block btn-text menu_list" style="text-align:left;'+
				'font-color:#94dc49; margin:0;height:40px;" id="'+ menuId +'">'+
				'<a href="#'+ menuId +'" data-toggle="tab" style="border-color:#FFFFFF">'+
				'<img src="img/rd.png" class="img-rounded">'+ menuData['title'] +'</a></li>');				
		}else{
			$("#menuUl").append('<li class="btn-block btn-text menu_list" style="text-align:left;'+
				'font-color:#94dc49; margin:0;height:40px;" id="'+ menuId +'">'+
				'<a href="#'+ menuId +'" data-toggle="tab" style="border-color:#FFFFFF">'+
				'<img src="img/rd.png" class="img-rounded">'+ menuData['title'] +'</a></li>');
		} 
	}
	
	/**
	 * List menu wise category
	 */
	function addCategoryList(menuTitle, categoryData){     
		var menuId = menuTitle.replace(/\s/g, '-');   
		//the following 'menuId' and in the 'addMenuList' functions 'menuId' value must be same 
		if( makeActive==0 ){
			var cats = '<div class="pull-left tab-pane active" id="'+ menuId +'" style="background-color:#dcfcfc;">';
			makeActive = 1;
		}else{
			var cats = '<div class="pull-left tab-pane" id="'+ menuId +'" style="background-color:#dcfcfc;">';
		}
		
		//now adding all the categories
		
		$.each(categoryData, function(i, v){ 
		
			var categoryId = 'cat_id_'+v['id'];
			
			cats += '<div class="pull-left span4 singleCategory" style="height:80px;margin:5px;border:2px solid #ccc;background-color:#fff; border-radius:5px;" id="'+ categoryId +'" >'+
					'<img src="'+ baseUrl + 'uploads/thumb/'+ v['thumb_img'] + '" class="pull-left" style="height:70px; width:70px; margin:2px;" />'+
					'<div class="pull-left span2">'+
						'<h4 style="line-height:15px; margin:1px;">'+ v['title'] +'</h4>'+
						'<div class=" span2" style="height:30px;line-height: 15px; margin:2px;">'+
							'<small style="line-height: 10px;">'+ v['descr'] +'</small>'+
						'</div>'+
					'</div>'+
					'<div class="pull-right">'+
						'<p class="text-right bg-success" style="background-color: #5BB75B; border-radius: 2px;">'+
							'5 Items</p>'+
					'</div>'+
				'</div>';
				
			addItems(categoryId, v['Item']);
		});
		cats += '</div>';
		$("#categorySection").append(cats);
	}
	
	
	/**
	 * categoryId format is 'cat_id_n'
	 */
	function addItems(categoryId, items){
		var itemHtm = '<div class="pull-left" id="items_by_cat_'+ categoryId +'" style="background-color:#dcfcfc;display:none;">';
		
		$.each(items, function(i, v){
			itemHtm += '<div class="pull-left span4" style="height:80px; margin:5px; border:2px solid #ccc; background-color:#fff; border-radius:5px;">'+
    			'<div class="pull-left span4" style="max-height:60px;">'+
        			'<h4 style="line-height: 15px; margin:1px;">'+ v['title'] +'</h4>'+
            		'<small style="line-height:10px;">'+ v['descr'] +'</small>'+
    			'</div>'+
    			'<div class="pull-left span1 ingredients">'+
        			'<small class="text-right bg-success" style="background-color: #DDDDDD; border-radius: 2px;">'+
        				'<a href="#launch" data-toggle="modal" class="modal_launch" id="launch_'+ v['id'] +'">Customize</a></small>'+
    			'</div>'+
    			'<div class="pull-left add_to_bucket" id="add_to_bucket_'+v['id']+'">'+
        			'<small class="text-right bg-success" style="background-color: #AABCCC; width: auto; margin-left:30px; border-radius: 2px;">Add to bucket</small>'+
    			'</div>'+
    			'<div class="pull-right">'+
        			'<small class="text-right bg-success" style="background-color: #5BB75B; border-radius: 2px;">Price '+ v['price'] +'</small>'+
    			'</div>'+
			'</div>';
			
			//keeping items globally
			allItemList[ v['id'] ] = v;
						
			if( v['is_featured'] ){
				addFeaturedItem(categoryId, v);
			}			
		});
		itemHtm += '</div>';
		
		$("#itemSection").append(itemHtm);
	}
	
	//add featured items
	function addFeaturedItem(categoryId, item){
		$("#featuredDiv").append('<div class="pull-left span4" style="height:80px; margin:5px; border:2px solid #ccc; background-color:#fff; border-radius:5px;">'+
			'<img src="'+ baseUrl + 'uploads/thumb/'+ item['thumb_img'] + '" class="pull-left" style="height:70px; width:70px; margin:2px;" />'+
			    '<div class="pull-left span2">'+
			        '<h4 style=" line-height: 15px; margin:1px;">'+ item['title'] +'</h4>'+
			        '<div class=" span2" style="height:30px;line-height: 15px; margin:2px;">'+
			            '<small style="line-height: 10px;">'+ item['descr'] +'</small>'+
			        '</div>'+			        
			    '</div>'+
			    '<div class="pull-right">'+
        			'<small class="text-right bg-success" style="background-color: #5BB75B; border-radius: 2px;">Price '+ item['price'] +'</small>'+
    			'</div>'+
			'</div>');
	}
	
	//add advertisement
	function addAdv(){
	}
	
	//Show categories of a Menu and hide items
	$(document).on('click', '.menu_list', function(){
		if( visible_items_div_id != false ){
			$("#"+visible_items_div_id).hide();
			visible_items_div_id = false;
		}
	});
	
	//Show items and hide categories
	$(document).on('click', '.singleCategory', function(){
		if( $(this).parent('div').hasClass('active') ){
			$(this).parent('div').removeClass('active');
		}
		$("#items_by_cat_"+$(this).attr('id')).show();
		visible_items_div_id = "items_by_cat_"+$(this).attr('id');
	});
	
	//add item to bucket
	$(document).on('click', '.add_to_bucket', function(){
		var tempId = $(this).attr('id'); 
		tempId = tempId.replace('add_to_bucket_','');
		
		itemAddToBucket(tempId, 1, 'all');
	});
	
	/**
	 * Add Item to bucket and update bucket quantity, price etc
	 *
	 */
	function itemAddToBucket(item_id, item_quantity, ingredients){
		totalPrice += ( parseInt(allItemList[item_id]['price']) * item_quantity);
		
		if( itemsInBucket[item_id]==undefined ){ 	
			//copying objects
			itemsInBucket[item_id] = $.extend({}, true, allItemList[item_id]);
			itemsInBucket[item_id]['quantity'] = item_quantity;		
			
			//passing the whole item
			update_bucket_items(itemsInBucket[item_id]);
		}else{
			itemsInBucket[item_id]['quantity'] += item_quantity;
			update_bucket_quantity(item_id);
		}
		if( ingredients !='all' ){
			itemsInBucket[item_id]['ingredients'] = ingredients;
		}		
		update_total_price();
	}
	
	//update bucket div with new selected item
	function update_bucket_items(item){
		$("#bucketDiv").append('<label>'+
		        '<input type="checkbox" class="selected_item" id="checkbox_'+ item['id'] + '" checked />'+item['title']+
		        '<span id="qty_span_'+ item['id'] +'"> ('+ itemsInBucket[item['id']]['quantity'] +
		        ' )</span>'+
		      '</label>');
	}
	
	//update item quantity in bucket
	function update_bucket_quantity( itemId ){
		$("#qty_span_"+itemId).html(' ('+itemsInBucket[itemId]['quantity']+')');
	}
	
	//update total price of selected items
	function update_total_price(){
		$("#totalPrice").html(''+totalPrice+'');
	}
	
	//processing ordered items to send in backend
	$("#orderNow").click(function(){
	
		if( itemsInBucket['waiter_n_table']==undefined ){
			var waiterInfo = {'waiter_n_table' : {'waiter_id':waiterId, 'table_id':tableId} };
			itemsInBucket.push(waiterInfo);
		}
		window.javascriptIF.placeOrder(JSON.stringify(itemsInBucket));
	});
	
	
	//when unchecked item from bucket: reduce total price, and remove item from bucket
	$(document).on('click', '.selected_item', function(){
		var tempId = $(this).attr('id');
		tempId = tempId.replace('checkbox_','');
		totalPrice -= ( ( parseInt(itemsInBucket[tempId]['quantity']) ) * ( parseInt(itemsInBucket[tempId]['price']) ) );
		$(this).parent('label').remove();
		
		itemsInBucket[tempId]=null;
		update_total_price();
	});
		
	//launching modal with ingredients
	$(document).on('click', '.modal_launch', function(e){
	
		//first making the modal empty
		$('#launch').html('');
		
		modalItemId = $(this).attr('id');
		modalItemId = modalItemId.replace('launch_','');
		
		var ingredients = allItemList[modalItemId]['ingredients'].split(',');
		
		$('#launch').append('<header class="modal-header" style="height:70px;margin-top:20px;">'+
		    '<button type="button" class="close" style="padding-top:-10px;" data-dismiss="modal">&times;</button>'+
		    '<img src="'+ baseUrl + 'uploads/thumb/'+ allItemList[modalItemId]['thumb_img'] + '" class="pull-left" style="height:70px; width:70px; margin:2px;" />'+
		    '<h3>'+ allItemList[modalItemId]['title'] +'</h3>'+
			  '</header>'+
			  '<h5>About Item</h5>'+
			    
			  '<div class="modal-body">'+
			    '<p>'+ allItemList[modalItemId]['descr'] +'</p>'+
			  '</div>'+
			  '<h5> Customize Item</h5>'+
			  		  
			  '<div class="modal-body">'+
			  	'<div class="checkbox">');
			  	
			//adding the ingredients
			$.each(ingredients, function(a,b){
				$('#launch').append('<label>'+
		      		'<input type="checkbox" style="margin-left:15px;" checked="checked" class="ingredients_checkbox selected" value="'+ b +'">'+ b +
		    	'</label>');
			});
		    
		    
		$('#launch').append('</div>'+
		  '</div>'+
		  '<footer class="modal-footer">'+
		  	'Quantity <input type="text" id="modal_qty_'+ modalItemId +'" style="width:30px; margin-right:20px;" value="1"/>'+
		    '<button class="btn btn-primary modal_add_to_bucket" id="modal_atob_'+ modalItemId +'" style="margin-top:-5px;" data-dismiss="modal">Add to bucket</button>'+
		  '</footer>');
	});
	
	//Select Deselect ingredients
	$(document).on('click', '.ingredients_checkbox', function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');
		}else{
			$(this).addClass('selected');
		}
	});
	
	//Getting all the selected ingredients and finally adding the item to bucket
	$(document).on('click', '.modal_add_to_bucket', function(){
		var selectedIngredients = '';
		var addComma = false;
		
		$.each($('.ingredients_checkbox'), function(i,v){
		    if( $(v).hasClass('selected') ){
		    	if( addComma==false ){
		    		selectedIngredients += v['value'];
		    		addComma = true;
		    	}else{
		    		selectedIngredients += ', '+ v['value'];
		    	}
		    }else{
		    	$(v).addClass('selected');
		    }
		});
		itemAddToBucket(modalItemId, parseInt($("#modal_qty_"+modalItemId).val()), selectedIngredients);		
	});	
	
	function showToast(message){
		window.javascriptIF.showToast(message);
	}
});