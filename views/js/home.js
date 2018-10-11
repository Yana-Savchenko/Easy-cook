
$(document).ready(() => {
    $("#sign-out").click((e) => {
        e.preventDefault();
        let date = new Date;
        date.setDate(date.getDate() - 1);
        document.cookie = "token=; path=/; expires=" + date.toUTCString();
        document.location.assign('/');
    })
})