$(document).ready(() => {
    localStorage.setItem('sortData', "firstName_down");
    localStorage.setItem('pageNumber', "1");
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
                               return document.location.assign('/user/profile');
                            }
                            if (res.status == 400) {
                                return res.text();
                             }
                        })
                        .then((res) => {
                            console.log('res', res);

                            $('.invalid-email').html(JSON.parse(res).message);
                        })
                        .catch(err => console.log('err', err))
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
                $('.img-rounded').attr('src', res.path);
                $("#filename").val('');
                $("#save-avatar").hide();
            })


    })

    // pagination
    $("#users-list").on("click", 'li', (e) => {
        e.preventDefault();
        let page = e.target.closest("li");
        let pageNumber = $(page).data("page");
        localStorage.setItem("pageNumber", pageNumber);
        let params = localStorage.getItem("sortData").split('_'); 
        let searchData = $(".search input").val()
        Api.get(`/user/all-users/search?page=${pageNumber}&column=${params[0]}&direction=${params[1]}&search_data=${searchData}`)
            .then((res) => {
                return res.text()
            })
            .then((res) => {
                $("#users-list").html(res);
                $("thead span").hide();
                $(`span.${params[0]}`).show();
            })
    })

    // sort
    $("#users-list").on("click", 'thead th', function (e) {
        let column = $(this).data("name");
        sortData = localStorage.getItem("sortData");
        if (sortData.split('_')[0] === column) {
            let tempData = sortData.split('_');
            if (tempData[1] === 'down') {
                tempData[1] = 'up';
                sortData = tempData.join('_');
            } else {
                tempData[1] = 'down';
                sortData = tempData.join('_');
            }
        } else {
            let tempData = sortData.split('_');
            tempData[0] = column;
            tempData[1] = 'down';
            sortData = tempData.join('_');
        }
        let params = sortData.split('_')
        localStorage.setItem("sortData", sortData)
        let searchData = $(".search input").val();
        let pageNumber = localStorage.getItem("pageNumber");
        Api.get(`/user/all-users/search?column=${params[0]}&direction=${params[1]}&page=${pageNumber}&search_data=${searchData}`)
            .then((res) => {
                return res.text()
            })
            .then((res) => {
                $("#users-list").html(res);
                $("thead span").hide();
                $(`span.${column}`).show();
            })
    })
    $(".search button").click(searchUsers);
    $('.search input').keypress((e) => {
        if (e.keyCode === 13) {
            searchUsers();
        }
    });

    $('.search input').on('input', _.debounce(searchUsers, 300));

    function searchUsers() {
        let data = $(".search input").val();
        localStorage.setItem("sortData", "firstName_down");
        Api.get(`/user/all-users/search?search_data=${data}`)
            .then((res) => {
                return res.text()
            })
            .then((res) => {
                $("#users-list").html(res);
                $("thead span").hide();
                $(`span.${localStorage.getItem("sortData").split('_')[0]}`).show();
            })
    }
});