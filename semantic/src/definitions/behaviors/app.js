$(function () {
    $('#sidebar').on('click', function () {
        $('.ui.sidebar')
            .sidebar({
                transition: 'push',
                dimPage: false,
                closable: false,
                // duration: 100,
                // useLegacy: true,
            })
            .sidebar('toggle');

    })

    $('.dropdown').dropdown();

    $('.checkbox').checkbox();

    $('.accordion').accordion();
})
