/*
 * Firebase 웹 앱 연결 정보입니다.
 * Realtime Database가 어느 지역에 만들어졌는지 아직 확정되지 않아
 * 친구방 연결 시 국내에서 주로 쓰는 싱가포르 주소와 기본 미국 주소를 차례로 확인합니다.
 * 데이터 접근은 반드시 firebase-database.rules.json의 보안 규칙으로 제한합니다.
 */
window.JPEconomyFirebaseConfig = {
  apiKey: 'AIzaSyD9mHiQ8Cyh4zJKbyhW_oYZkcu3WPMYw3k',
  authDomain: 'jpmathlab.firebaseapp.com',
  projectId: 'jpmathlab',
  storageBucket: 'jpmathlab.firebasestorage.app',
  messagingSenderId: '1061208248935',
  appId: '1:1061208248935:web:839fa3cc986bc687cebac2',
  databaseURLs: [
    'https://jpmathlab-default-rtdb.asia-southeast1.firebasedatabase.app',
    'https://jpmathlab-default-rtdb.firebaseio.com'
  ]
};
