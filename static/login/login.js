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

document.addEventListener("DOMContentLoaded", function () {
    function login() {
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: { id_give: $('#userid').val(), pw_give: $('#userpw').val() },
            success: function (response) {
                if (response['result'] === 'success') {
                    $.cookie('mytoken', response['token']);
                    Swal.fire({
                        title: "로그인 성공",
                        icon: "success",
                        confirmButtonText: "확인",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/';
                        }
                    });
                } else {
                    Swal.fire({
                        title: "로그인 실패",
                        icon: "error",
                        confirmButtonText: "확인",
                    });
                }
            }
        });
    }
    
    document.querySelector('.login').addEventListener('click', login);
    
    function redirectToSignup() {
        window.location.href = '/signup';
    }
    
    document.querySelector('.signup').addEventListener('click', redirectToSignup);
    
});
