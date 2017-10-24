$(document).ready(function () {
    $('.menu_toggle').click(function () {
        $('body').toggleClass('menu_opened')
    });

    // datepicker
    $(function () {
        $('.datepicker').datetimepicker();
    });

    // Message Contact List
    $('.contacts_list_Toggle').click(function () {
        $(this).toggleClass('active')
        $('.messages_centre .contacts_list').toggleClass('active')
    });
});