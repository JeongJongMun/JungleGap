from flask import Flask, render_template, request, jsonify
import jwt
import datetime
from functools import wraps
from pymongo import MongoClient

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/mydatabase'  # MongoDB 연결 URI

mongo = MongoClient(app.config['MONGO_URI'])
db = mongo.mydatabase  # 데이터베이스 선택

# 사용자 데이터베이스 컬렉션
users_collection = db.users

# 토큰 생성 함수
def generate_token(username):
    expiration_date = datetime.datetime.utcnow() + datetime.timedelta(days=1)
    token = jwt.encode({'username': username, 'exp': expiration_date},
                      app.config['SECRET_KEY'], algorithm='HS256')
    return token

# 사용자 인증 함수
def authenticate(username, password):
    user = users_collection.find_one({'username': username, 'password': password})
    return user is not None

# 회원가입 함수
def signup(username, password):
    # 이미 등록된 사용자인지 확인
    existing_user = users_collection.find_one({'username': username})
    if existing_user:
        return False, '이미 등록된 사용자입니다.'

    # 새로운 사용자 추가
    users_collection.insert_one({'username': username, 'password': password, 'score': 0})
    return True, '회원가입 성공'

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

# 루트 URL에 대한 핸들러 추가
@app.route('/')
def home():
    return render_template('login.html')

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

# 회원가입 페이지 렌더링
@app.route('/signup', methods=['GET'])
def signup_page():
    return render_template('signup.html')

# 회원가입 엔드포인트
@app.route('/signup', methods=['POST'])
def signup():
    username = request.form.get('username')
    password = request.form.get('password')
    repassword = request.form.get('repassword')

    if not username or not password or not repassword:
        return render_template('error.html', message='회원가입 정보가 부족합니다.'), 400

    if password != repassword:
        return render_template('error.html', message='비밀번호가 일치하지 않습니다.'), 400

    success, message = signup(username, password)

    if success:
        return render_template('success.html', message=message)
    else:
        return render_template('error.html', message=message), 400

# 보호된 엔드포인트
@app.route('/protected', methods=['GET'])
@token_required
def protected(current_user):
    return render_template('protected.html', current_user=current_user)

if __name__ == '__main__':
    app.run(debug=True)
