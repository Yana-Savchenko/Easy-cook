
$(document).ready(() => {
    $("#sign-in").click((e) => {
        e.preventDefault();
        const formData = $("form").serializeArray();
        const user = {
            email: formData[0].value,
            pass: formData[1].value
        }
        const options = {
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        Api.post('/auth/sign-in', options)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            }
        })
        .then((res) => {
            console.log(res);
            document.cookie = "token=" + res.token + "; path=/";
            document.location.assign('/home');
        }
        )
    })
})