function showRanking(ranking_list) {
    $(".modalBackground").addClass("show");
    $("#ranking-list").empty();

    for (var i = 0; i < ranking_list.length; i++) {
        var rank = i + 1;
        var id = ranking_list[i]['id'];
        var score = ranking_list[i]['score'];
        $("#ranking-list").append("<li>" + rank + "위 " + id + " " + score + "점" + "</li>");
    }
}


function closeRanking() {
    $(".modalBackground").removeClass("show");
}

window.onload = function () {
    $("#ranking").click(function () {
        showRanking(ranking_list);
    });
    $("#close").click(closeRanking);
}
function logout() {
    $.removeCookie();
    alert('로그아웃 성공')
    window.location.href = '/login'
}

function redirectToIngame() {
    var token = $.cookie('mytoken');
    if (token) {
        window.location.href = '/ingame?token=' + token;
    } else {
        alert('로그인이 필요합니다.');
    }
}