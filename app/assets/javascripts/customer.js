// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready = function(){
	datatable = $('#customers_table').DataTable({
		ajax:{
			url:'/get_customers',
          	type : 'GET',
          	data : {'authenticity_token':AUTH_TOKEN }
		},
		"columnDefs": [{
     		"data": null,
      		"defaultContent": "<div class='table-btn add-trans'><span class='fa fa-money text-success'></span></div><div class='table-btn view-trans'><span class='fa fa-eye text-info'></span></div>",
      		"targets": -1,
      		"createdCell":  function (td, cellData, rowData, row, col) {
           		$(td).addClass('p-0'); 
        	   },
          },
          {
            "targets":[1,2,3,5],
            "orderable":false
          },   
          {
            "render": function ( data, type, row ) {
                    return "<span class='fa fa-inr'></span> "+data;
                },
             "createdCell":  function (td, cellData, rowData, row, col) {
                              $(td).addClass('text-right'); 
                            },
                "targets": -2
          }
    	],
    	"createdRow": function( row, data, dataIndex ) {
      			$(row).data('id',data[data.length-1]);
            $(row).data('due',data[4]);
            $(row).data('name',data[0]);
  		}
	});
  $(document).on('click','.view-trans',function(){
    var current = $('#view_trans').attr('data-current');
    var row = $(this).closest('tr');
    var id = $(row).data('id');
    var name = $(row).data('name');
    var due = $(row).data('due');
    $('#customer_due').html(due);
    $('.view-trans-container').removeClass('d-none');
    $('.add-trans-container').addClass('d-none');
    $('#view_trans').find('.modal-dialog').addClass('modal-lg')
    if(current != id){
      if(typeof customer_datatable !== 'undefined'){
        customer_datatable.destroy();
      }
      customer_datatable = $('#customer_transactions').DataTable({
        ajax:{
          url:'/customers/get_transactions',
          type : 'GET',
          data : {'authenticity_token':AUTH_TOKEN,'id':id }
        },
        'initComplete':function(settings,json){
          $('#view_trans').attr('data-current',id);
          $('#view_trans').modal('show');
        },
        'pageLength' : 6,
        "lengthMenu": [[6,10, 25, 50, -1], [6,10,25, 50, "All"]]
      });
    }else{
      $('#view_trans').modal('show');
    }
    
  });
  $(document).on('click','.add-trans',function(){
    var ele = $(this).closest('tr');
    var id = ele.data('id');
    var due = ele.data('due');
    var name = ele.data('name');
    $('#customer_id').val(id);
    $('#customer_name').html(name);
    $('#customer_due').html(due);
    $('#cust_due').val(due);
    $('.view-trans-container').addClass('d-none');
    $('.add-trans-container').removeClass('d-none');
    $('#view_trans').find('.modal-dialog').removeClass('modal-lg');
    $('#view_trans').modal('show');
  });
  $('#customer_transaction').validate($.extend(validator_commons,{
    rules:{
      'amount':{required:true,lessThan:'#cust_due'}
    },
    messages:{
      'amount':{required:'please enter money',lessThan:"Money must be less than due."}
    }
  }));
}
$(document).ready(ready)