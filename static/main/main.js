function showRanking(ranking_list) {
    $("#modalBackground").addClass("opacity-100", "z-1000", "transition-all", "duration-500");
    $("#modalBackground").removeClass("-z-10");
    $("#ranking-list").empty();

    for (var i = 0; i < ranking_list.length; i++) {
        var rank = i + 1;
        var id = ranking_list[i]['id'];
        var score = ranking_list[i]['score'];
        $("#ranking-list").append("<li class='mx-20 px-10 pl-40 text-customListFontSize1 text-nowrap font-jgF1'>" + rank + "위 " + id + "      " + score + "점" + "</li>");
    }
}

function closeRanking() {
    $("#modalBackground").removeClass("opacity-100", "z-1000", "transition-all", "duration-500");
    $("#modalBackground").addClass("-z-10");
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