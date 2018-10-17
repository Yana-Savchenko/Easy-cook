
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

    $(".file-upload input[type=file]").change(function () {
        var filename = $(this).val().replace(/.*\\/, "");
        $("#filename").val(filename);
        $("#save-avatar").show();
    });
    $("#save-avatar").click(() => {
        const formData = new FormData();
        const imagefile = document.querySelector('input[name="avatar"]');
        formData.append("avatar", imagefile.files[0]);
        Api.post('avatar/', {
            body: formData,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log('here we go', res);
                $('.img-rounded').attr('src', res.path);
                $("#filename").val('');
                $("#save-avatar").hide();
            })


    })

    $("#users-list").on("click", 'li', (e) => {
        e.preventDefault();
        let page = e.target.closest("li");
        page = $(page).data("page");
        Api.get(`/user/all-users/${page}`)
          .then((res) => {
              return res.text()
            })
            .then((res) => {
                $("#users-list").html(res);
          })
    })
});