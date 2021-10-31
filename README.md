------- API --------
--POST--
login patient: '/data-login-patient'
login doctor: '/data-login-doctor'
findOne patient:'/data-a-patient'
--GET--
list patients:'/data-patient'
list doctor:'/data-doctor'
list devices:'data-device'
-----------------------
--Git--
link: https://github.com/manhdv0901/group-health-project-33
--Heroku--
link: https://web-test-3010.herokuapp.com/

Note:
Mọi người làm việc trên git sẽ phải tạo nhánh mới bằng câu lệnh: git checkout -b tên_nhánh, ko được làm việc trên nhánh chính là nhánh 'master'
Trước khi push git lên sever thì cần phải 'git checkout master' để về nhánh chính rồi 'git pull' hoặc 'git pull origin master' để lấy từ code từ nhánh master về, sau đó dùng 'git checkout nhánh_làm_việc' để quay lại nhánh của của mình làm và dùng lệnh 'git merge master' để tối ưu hóa code của 2 nhánh xong sau đó 'git push' để đẩy code lên trên sever.(Nên dùng vsCode thì khi git merge sẽ dễ dàng hơn trong việc merge).
