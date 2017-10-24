$(document).ready(function(){

    // Menu
    $('.menu_toggle').click(function(){
        $('body').toggleClass('menu_opened')
    });

    // Message Contact List
    $('.contacts_list_Toggle').click(function(){
        $('.messages_centre .contacts_list').addClass('active')
    });
});