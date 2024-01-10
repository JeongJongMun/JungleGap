tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                jgF1: ['Pretendard-Regular, WarhavenB']
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
                if (response['result'] == 'success') {
                    alert('회원가입 완료')
                    window.location.href = '/login'
                } else if (response['result'] == 'notid') {
                    alert('아이디를 입력하세요.')
                } else if (response['result'] == 'notpw') {
                    alert('비밀번호를 입력하세요.')
                } else {
                    alert('이미 있는 아이디입니다.')
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