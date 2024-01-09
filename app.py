from flask import Flask, render_template, request, jsonify, make_response
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'

# 사용자 데이터베이스
users = {
    'username': 'password'
}

# 토큰 생성 함수
def generate_token(username):
    expiration_date = datetime.datetime.utcnow() + datetime.timedelta(days=1)
    token = jwt.encode({'username': username, 'exp': expiration_date},
                      app.config['SECRET_KEY'], algorithm='HS256')
    return token

# 사용자 인증 함수
def authenticate(username, password):
    # 실제 시스템에서는 안전한 방식으로 비밀번호를 저장하고 확인해야 함
    return users.get(username) == password

# 토큰 확인 데코레이터
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return render_template('error.html', message='토큰이 없습니다!'), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['username']
        except:
            return render_template('error.html', message='토큰이 유효하지 않습니다!'), 401

        return f(current_user, *args, **kwargs)

    return decorated

# 로그인 페이지 렌더링
@app.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')

# 로그인 엔드포인트
@app.route('/login', methods=['POST'])
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return render_template('error.html', message='로그인 정보가 부족합니다.'), 401

    if authenticate(auth.username, auth.password):
        token = generate_token(auth.username)
        return render_template('token.html', token=token)

    return render_template('error.html', message='인증 실패'), 401

# 보호된 엔드포인트
@app.route('/protected', methods=['GET'])
@token_required
def protected(current_user):
    return render_template('protected.html', current_user=current_user)

if __name__ == '__main__':
    app.run(debug=True)
