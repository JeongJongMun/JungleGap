tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                jgF1: ['Pretendard-Regular', 'WarhavenB']
            },
            colors: {
                customJgColor1: "#254E3CFF",
                customJgColor2: "#FF9800FF",
                customJgColor3: "#5F8670CC"
            },
            fontSize: {
                customFontSize1: '100px',
            },
        },
    },
};

document.addEventListener("DOMContentLoaded", function() {
    function signup() {
        $.ajax({
            type: "POST",
            url: "/api/signup",
            data: {
                id_give: $('#userid').val(),
                pw_give: $('#userpw').val()
            },
            success: function (response) {
                if (response['result'] === 'success') {
                    Swal.fire({
                        title: "로그인 성공",
                        icon: "success",
                        confirmButtonText: "확인",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/login';
                        }
                    });
                } else if (response['result'] === 'notid') {
                    Swal.fire({
                        title: "아이디를 입력해주세요.",
                        icon: "error",
                        confirmButtonText: "확인",
                    });
                } else if (response['result'] === 'notpw') {
                    Swal.fire({
                        title: "비밀번호를 입력해주세요.",
                        icon: "error",
                        confirmButtonText: "확인",
                    });
                } else {
                    Swal.fire({
                        title: "이미 있는 아이디 입니다.",
                        icon: "error",
                        confirmButtonText: "확인",
                    });
                }
            }
        })
    }
    document.querySelector('.signup_jg').addEventListener('click', signup);
    function redirectToLogin() {
        window.location.href = '/login';
    }
    document.querySelector('.back_jg').addEventListener('click', redirectToLogin);
});
