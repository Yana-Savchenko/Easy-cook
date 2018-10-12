
$(document).ready(() => {
    $("#sign-out").click((e) => {
        e.preventDefault();
        let date = new Date;
        date.setDate(date.getDate() - 1);
        document.cookie = "token=; path=/; expires=" + date.toUTCString();
        document.location.assign('/');
    });
    $("#edit").click(() => {
        $(".view-details").hide();
        $(".edit-details").show();
    })
    $("#save").click(() => {
        let user = {
            firstName: $("#first-name").val(),
            lastName: $("#last-name").val(),
            email: $("#email").val(),
            age: $("#age").val(),
        }
        const options = {
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        Api.put('/user/profile', options)
        .then((res) => {
            if (res.status == 200) {
                document.location.assign('/user/profile');
            }
        })
    })
    $("#cancel").click(() => {
        $(".view-details").show();
        $(".edit-details").hide();
    });
});