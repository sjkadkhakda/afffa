//声明计时器
let intervalId
let TimeintervalId
let toTopIntervalId
// 声明一个存储英雄的图片和名字的数组
const arr = [
    {url:"./images/1.jpg",p:"猪猪侠",color:"rgb(255,0,0)" ,href:"https://baike.baidu.com/item/%E7%8C%AA%E7%8C%AA%E4%BE%A0/9565890"},
    {url:"./images/2.jpg",p:"小呆呆",color:"#1fef04" ,href:"https://baike.baidu.com/item/%E5%B0%8F%E5%91%86%E5%91%86?fromModule=lemma_search-box"},
    {url:"./images/3.jpg",p:"超人强",color:"#0462ef" ,href:"https://baike.baidu.com/item/%E8%B6%85%E4%BA%BA%E5%BC%BA/9631566"},
    {url:"./images/4.jpg",p:"波比",color:"#25cece" ,href:"https://baike.baidu.com/item/%E6%B3%A2%E6%AF%94/17179774?fromModule=search-result_lemma"},
    {url:"./images/5.jpg",p:"小菲菲",color:"#ca6060" ,href:"https://baike.baidu.com/item/%E8%8F%B2%E8%8F%B2/8639357?fromModule=search-result_lemma"},
]
// 正面左侧面和右侧面的图片索引
let index =0
//获取元素
const displayHero=document.querySelector('.displayHero')
const front =document.querySelector('.front')
const leftSide=document.querySelector('.leftSide')
const rightSide=document.querySelector('.rightSide')
const name =document.querySelector('.heroName')
const indicators=document.querySelectorAll('.indicator')
const alink=document.getElementById('heroLink')
const day =document.querySelector('.dn')
const hour =document.querySelector('.hn')
const minute =document.querySelector('.mn')
const second =document.querySelector('.sn')
// 更新图片和文字的函数
function update(){
    front.style.backgroundImage=`url('${arr[index].url}')`
    leftSide.style.backgroundImage=`url('${arr[(index+4)%5].url}')`
    rightSide.style.backgroundImage=`url('${arr[(index+1)%5].url}')`
    name.innerText=`${arr[index].p}`
    name.href=`${arr[index].href}`
    name.style.color=`${arr[index].color}`
    front.addEventListener('click', function () {
window.open(`${arr[index].href}`) ;
});
}// 跳转至下一个的函数
function next(){
    index=(index+1)%5
    update()
}
// 跳转至上一个的函数
function last(){
    index=(index+4)%5
    update()
}
//点击左右两张图片进行上下切换
rightSide.addEventListener('click',next)
leftSide.addEventListener('click',last)
//给中间的图片添加跳转链接

// 定时器
function startNext(){
    intervalId =setInterval(next,2000)//每两秒自动切换一次
}
// 清空定时器
function stopNext(){
    clearInterval(intervalId)
}
displayHero.addEventListener('mouseleave',startNext)
displayHero.addEventListener('mouseenter',stopNext)
//结束时间
const end =new Date('2025-01-28T00:00:00').getTime();
//倒计时更新函数
function updateCountdown(){
    const now=new Date().getTime()
    console.log("updateCountdown is called");
    const timeRemaining =end-now;
    if(timeRemaining<=0){
        alert('新年快乐！')
    }
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    day.innerHTML=days.toString().padStart(2,'0')
    hour.innerHTML=hours.toString().padStart(2,'0')
    minute.innerHTML=minutes.toString().padStart(2,'0')
    second.innerHTML=seconds.toString().padStart(2,'0')
}
//倒计时刷新函数
function timeCountdown(){
    TimeintervalId=setInterval(updateCountdown,1000)
}
window.onload = function () {
    timeCountdown();
};
//回到顶部
// 获取回到顶部按钮元素
const backToTopButton = document.getElementById('toTop');

// 当页面滚动时触发的函数
window.onscroll = function () {
// 获取当前滚动的垂直距离
const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
if (scrollTop > 200) {
    // 如果滚动距离大于200px，显示回到顶部按钮
    backToTopButton.style.display = 'block';
} else {
    // 否则隐藏按钮
    backToTopButton.style.display = 'none';
}
};

// 点击回到顶部按钮时触发的函数
backToTopButton.addEventListener('click', function () {
        const startPosition = document.documentElement.scrollTop || document.body.scrollTop;
        const duration = 500; // 滚动到顶部的总时长，单位毫秒，可以根据需求调整
        let startTime = null;

        function scrollToTop(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }
            const progress = timestamp - startTime;
            const easeInOutQuad = function (t) {
                return t < 0.5? 2 * t * t : -1 + (4 - 2 * t) * t;
            };
            const percentage = Math.min(progress / duration, 1);
            const easedPercentage = easeInOutQuad(percentage);
            const newPosition = startPosition * (1 - easedPercentage);
            document.documentElement.scrollTop = newPosition;
            document.body.scrollTop = newPosition;
            if (progress < duration) {
                requestAnimationFrame(scrollToTop);
            } else {
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }
        }
        requestAnimationFrame(scrollToTop);
    });
    //获取产品库元素
    var productImgs=document.querySelectorAll('.product-item-img')
    var productShadow=document.querySelectorAll('.product-item-shadow')
    var infoDetails=document.querySelectorAll('.info-detail')
    var infotitles=document.querySelectorAll('.info-title')
    var infoAlink=document.querySelectorAll('.info-alink')
    //产品库
    var productData=[
        {img:'./images/superbangbangtang.jpg',imgShadow:'./images/superbangbangtangshadow.jpg', productName:'超级棒棒糖',introduce:'拥有神奇的力量', price:888},
        {img:'./images/wulingsuo.jpg',imgShadow:'./images/wulingsuoshadow.jpg', productName:'五灵锁',introduce:'可以变身成五种兽型战士', price:9999},
        {img:'./images/baojian.jpg',imgShadow:'./images/wulingsuoshadow.jpg', productName:'猪猪开天宝剑',introduce:'猪猪侠的无敌神器', price:9.9},
    ]
    //修改产品库的背景
    productImgs[0].style.background=`url('${productData[0].img}')`
    productImgs[1].style.background=`url('${productData[1].img}')`
    productImgs[2].style.background=`url('${productData[2].img}')`
    productShadow[0].style.background=`url('${productData[0].imgShadow}')`
    productShadow[1].style.background=`url('${productData[1].imgShadow}')`
    productShadow[2].style.background=`url('${productData[2].imgShadow}')`
    infotitles[0].innerText=`${productData[0].productName}`
    infoDetails[0].innerText=`${productData[0].introduce}`
    infotitles[1].innerText=`${productData[1].productName}`
    infoDetails[1].innerText=`${productData[1].introduce}`
    infotitles[2].innerText=`${productData[2].productName}`
    infoDetails[2].innerText=`${productData[2].introduce}`
    //修改导航栏在不同位置的颜色和透明情况
    var menu =document.querySelector('.menu')
    var head =document.querySelector('.head')
    var headHeight=head.offsetHeight;
    var headTop=head.offsetTop;
    var menuItems=document.querySelectorAll('.menu-item')
    var menuCurrent=document.querySelector('.menu-current')
    var logo=document.querySelector('.logo')
    var TitleSignin=document.querySelector('.menu-title-signin')
    var blackBlock=document.querySelector('.menu-title-black-block')
    var hrs =document.querySelector('.hrs')
    var selections =document.querySelector('.selection')
    function wenZi() {
    var selections = document.querySelectorAll('.selection');
    var hrs = document.querySelectorAll('.hr');
    selections.forEach(function (selections, index) {
    var sectionTop = selections.offsetTop;
    var sectionHeight = selections.offsetHeight;
    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        hrs[index].style.color='rgba(255, 0, 0, 1)'
        hrs[index].style.fontSize=" 20px";
        hrs[index].style.marginTop=" 28px";
        hrs[index].style.fontWeight=" bolder";
        hrs[index].style.letterSpacing=" 2.5px";
        
    } else {
        hrs[index].style.color='rgba(100, 100, 100, 1)'
        hrs[index].style.fontWeight=" normal";
        hrs[index].style.fontSize=" 15px";
        hrs[index].style.marginTop=" 33px";
        hrs[index].style.letterSpacing=" 0px";
        
    }
   
});
}
    function nav(){
        if (window.pageYOffset>headHeight){
            menu.style.backgroundColor='rgba(255, 255, 255, 1)'
            logo.src='./images/logo2.png'
            TitleSignin.style.color="black"
            blackBlock.style.color="white"
            blackBlock.style.backgroundColor="black"
            
        }else{
            menu.style.backgroundColor='rgba(255, 255, 255, 0.0)'
            logo.src='./images/logo.png'
            TitleSignin.style.color="white"
            blackBlock.style.color="black"
            blackBlock.style.backgroundColor="white"
            
        }
        
    }
    
    
    window.addEventListener('scroll',wenZi);
    window.addEventListener('scroll',nav)
    //给导航栏每个元素添加事件
    menuItems.forEach(function(menuItem){
        menuItem.addEventListener('mouseenter',function(){
            menuItem.style.letterSpacing='5px'
            if (window.pageYOffset>headHeight){
                menuItem.style.color='rgba(255,0, 0, 1)'
            }
        })
        menuItem.addEventListener('mouseleave',function(){
            menuItem.style.letterSpacing='0px'
            if (window.pageYOffset>headHeight){
                menuItem.style.color='rgba(100, 100, 100,1)'
            }else{
                menuItem.style.color='rgba(200, 200, 200, 1)'
            }
        })
    })
//登录弹窗
//获取弹窗元素
var loginButton=document.querySelector('.menu-title-signin')
var menuTitleBlackBlock=document.querySelector('.menu-title-black-block')
var login=document.querySelector('.login')
var coverPage=document.querySelector('.cover-page')
var x=document.querySelector('.x')
var loginTab=document.querySelector('.login-tab')
var enrollTab=document.querySelector('.enroll-tab')
var loginUser=document.querySelector('.login-user')
var enrollEnsurePassword=document.querySelector('.enroll-ensurePassword')
var loginBotton=document.querySelector('.login-botton')
var enrollBotton=document.querySelector('.enroll-botton')
var loginTabSelect=document.querySelector('.login-tab-select')
var loginTabTabSelect=document.querySelector('.login-tab-tab-select')
var loginImage=document.querySelector('.login-image')
var loginLogo=document.querySelector('.login-logo')
var loginVerify=document.querySelector('.loginVerify')
var enrollVerify=document.querySelector('.enrollVerify')
var UserAvatar=document.querySelector('.UserAvatar')
var clearInputX=document.querySelector('.clearInputX')


var imagesIndex=1
var logoIndex=1
var EnrollIndex=0
var loginIndex=1
var logedIndex=0



//切换注册界面时，登录元素消失
function openEnrollPage(){
clearInput()
enrollBotton.style.display='block'
enrollEnsurePassword.style.display='block'
loginTabTabSelect.style.backgroundColor='black'
loginBotton.style.display='none'
loginTabSelect.style.backgroundColor='white'
loginTab.style.color='rgba(200,200,200,1)'
enrollTab.style.color='rgba(0,0,0,1)'
EnrollIndex=1
loginIndex=0
}
//切换登录界面时，注册元素消失
function openLoginPage(){
clearInput()
loginTabTabSelect.style.backgroundColor='white'
enrollBotton.style.display='none'
enrollEnsurePassword.style.display='none'
loginTabSelect.style.backgroundColor='black'
loginBotton.style.display='block'
loginTab.style.color='rgba(0,0,0,1)'
enrollTab.style.color='rgba(200,200,200,1)'
EnrollIndex=0
loginIndex=1
}
loginTab.addEventListener('click',openLoginPage)
enrollTab.addEventListener('click',openEnrollPage)
//登录页面弹出函数
function loginPage(){
login.style.display="block"
coverPage.style.display="block"
document.body.style.overflow="hidden"
}
//登陆页面关闭寒素
function closeLoginPage(){
login.style.display="none"
coverPage.style.display="none"
document.body.style.overflow="auto"
}
//点击登录时，登录页面弹出，遮罩显现
loginButton.addEventListener('click',function(){
loginPage()
openLoginPage()
})
//点击注册时，登录页面弹出，遮罩显现
menuTitleBlackBlock.addEventListener('click',function(){
loginPage()
openEnrollPage()
})
//点击x时，登录页面消失，遮罩消失
x.addEventListener('click',closeLoginPage)
//点击图片进行更换
loginImage.addEventListener('click',function(){
if (imagesIndex===1) {
    loginImage.src='./images/bqb02.gif'
    imagesIndex=2
}else if(imagesIndex===2){
loginImage.src='./images/bqb03.gif'
    imagesIndex=3
}else if(imagesIndex===3){
loginImage.src='./images/bqb04.gif'
    imagesIndex=4
}else{
    imagesIndex=1
loginImage.src='./images/bqb01.gif'
}
})
loginLogo.addEventListener('click',function(){
if(logoIndex===1){
    loginLogo.src='./images/logo.png'
    logoIndex=2
}else if(logoIndex==2){
    loginLogo.src='./images/logo2.png'
    logoIndex=1
}
})
//用户登录时的用户头像出现
function logged(){
UserAvatar.style.display='block'
TitleSignin.style.display='none'
blackBlock.style.display='none'
logedIndex=1
}
function notLogged(){
UserAvatar.style.display='none'
TitleSignin.style.display='block'
blackBlock.style.display='block'
logedIndex=0
}
// 存储用户数据数组
function storeUserArray(key, userArray) {
localStorage.setItem(key, JSON.stringify(userArray));
}

//存储用户数组
var users = [
    { userName: "TJW", Password: "123456", avatar: "./images/UserAvatar/UserAvatar.png" },
    { userName: "ZXJ", Password: "123456", avatar: "./images/UserAvatar/UserAvatar.png" }
];
storeUserArray('users', users);
/// 检索用户数据数组
function getUserArray(key) {
var userArray = localStorage.getItem(key);
    if (userArray) {
        return JSON.parse(userArray);
     }
return null; // 如果没有找到数据，返回null
}

//更改用户信息函数
var dropdownUsername=document.querySelector('.dropdownUsername')
function changeInformation(userName){
dropdownUsername.innerText=`${userName}`
}
//清空input内容函数
function clearInput(){
var inputs=document.querySelectorAll('.input')
inputs.forEach(function(input){
    input.value=''
})
}
clearInputX.addEventListener('click',function(){
clearInput()
})

//注册合法验证
enrollBotton.addEventListener('click',function(){
    var input=document.querySelectorAll('.input')
    var userName=input[0].value
    var Password=input[1].value
    var EnsurePasswd=input[2].value

    // 检查用户名是否为空
    if(userName.split('').length=='0'){
        enrollVerify.innerText="请输入用户名"
        enrollVerify.classList.add('show');
    }
    // 检查用户名长度
    else if(userName.split('').length<3||userName.split('').length>=16){
        enrollVerify.innerText="用户名长度为3-16字符"
        enrollVerify.classList.add('show');
    }
    // 检查用户名是否已存在
    else if(users.some(user => user.userName === userName)){
        enrollVerify.innerText="用户名已存在"
        enrollVerify.classList.add('show');
    }
    // 检查密码是否为空
    else if(Password.split('').length===0){
        enrollVerify.innerText="请输入密码"
        enrollVerify.classList.add('show');
    }
    // 检查密码长度
    else if(Password.split('').length<6||Password.split('').length>16){
        enrollVerify.innerText="密码长度为6-16字符"
        enrollVerify.classList.add('show');
    }
    // 检查确认密码是否为空
    else if(EnsurePasswd.split('').length===0){
        enrollVerify.innerText="请确认密码"
        enrollVerify.classList.add('show');
    }
    // 检查两次密码是否一致
    else if(EnsurePasswd!=Password){
        enrollVerify.innerText="确认密码失败"
        enrollVerify.classList.add('show');
    }
    // 所有验证通过,注册成功
    else{
        enrollVerify.innerText="注册成功"
        enrollVerify.classList.add('show');
        users.push({
            userName,
            Password,
            avatar: "./images/UserAvatar/UserAvatar.png"
        })
        closeLoginPage()
        logged()
        clearInput()
        changeInformation(userName)
        updateAvatars("./images/UserAvatar/UserAvatar.png")
    }

    if (enrollVerify.classList.contains('show')) {
        setTimeout(function() {
            enrollVerify.classList.remove('show');
        }, 1000); 
    }
})
//登录事件
loginBotton.addEventListener('click',function(){
var input=document.querySelectorAll('.input')
var userName=input[0].value
var Password=input[1].value
var user = users.find(u => u.userName === userName && u.Password === Password);
if(user){
    loginVerify.innerText="登录成功"
    loginVerify.classList.add('loginVerifyShow');
    closeLoginPage()
    logged()
    clearInput()
    changeInformation(userName)
    updateAvatars(user.avatar)
}else{
    loginVerify.innerText="登录失败"
    loginVerify.classList.add('loginVerifyShow');
}

if (loginVerify.classList.contains('loginVerifyShow')) {
setTimeout(function() {
    loginVerify.classList.remove('loginVerifyShow');
}, 1000); 
}
console.log(users)

} )

//用户头像下拉展示用户信息
var hideTimer
var dropdownContent=document.querySelector('.dropdown-content')
UserAvatar.addEventListener('mouseover',function(){
dropdownContent.style.display='block'
dropdownContent.classList.add('show-dropdown')
})
UserAvatar.addEventListener('mouseout',function(){
hideTimer = setTimeout(function() {
dropdownContent.classList.remove('show-dropdown')
dropdownContent.style.display = 'none';
}, 250); // 250ms的延迟
})
// 当鼠标在下拉内容上时，清除计时器，防止下拉菜单关闭
dropdownContent.addEventListener('mouseover', function(event) {
clearTimeout(hideTimer);
});

// 当鼠标从下拉内容移出时，重新开始计时
dropdownContent.addEventListener('mouseout', function(event) {
event.stopPropagation(); // 防止冒泡到.dropdown的mouseout事件
hideTimer = setTimeout(function() {
dropdownContent.classList.remove('show-dropdown')
dropdownContent.style.display = 'none';
}, 250); // 250ms的延迟
});

//退出登录
var SignOut=document.querySelector('.SignOut')
SignOut.addEventListener('click',function(){
    dropdownContent.style.display = 'none';
    notLogged() 
    marketToHead()
    // 恢复默认头像
    updateAvatars("./images/UserAvatar/UserAvatar.png")
})

// 获取商城相关DOM元素
var market = document.querySelector('.market')
var indexPage = document.querySelector('.index')
var productPage = document.querySelector('.product-page')
var purchasePage = document.querySelector('.purchase')
var product = document.querySelectorAll('.product')
var commodityImgs = document.querySelectorAll('.product-img')
var commodityNames = document.querySelectorAll('.product-name')
var commodityPrices = document.querySelectorAll('.product-price')
var purchaseProduct = document.querySelector('.purchase-product')
var purchaseShow = document.querySelector('.purchase-show')
var ShowImg = document.querySelector('.purchase-show-img')
var purchaseLens = document.querySelector('.purchase-lens')
var LensImg = document.querySelector('.purchase-lens-img')
var purchaseName = document.querySelector('.purchase-name')
var purchasePrice = document.querySelector('.purchase-price')
var mask = document.querySelector('.mask')

// 跳转到商城界面
function headToMarket(){
    // 未登录时显示登录框
    if (logedIndex === 0){
        loginPage()
    } else {
        market.style.display = 'block'
        indexPage.style.display = 'none'
        menuItems[4].classList.add('active')
        purchasePage.style.display = 'none'
        productPage.style.display = 'flex'
    }
}

// 跳转回首页
function marketToHead(){
    market.style.display = 'none'
    indexPage.style.display = 'block'
    menuItems[4].classList.remove('active')
}

// 跳转到商品购买页
function Topurchase(){
    headToMarket()
    purchasePage.style.display = 'flex'
    productPage.style.display = 'none'
}

// 添加导航菜单跳转事件
for(let i = 0; i < 4; i++){
    menuItems[i].addEventListener('click', marketToHead)
}
menuItems[4].addEventListener('click', headToMarket)

// 更新商城商品展示
for (let i = 0; i < commodityImgs.length; i++){
    // 设置商品图片、名称和价格
    commodityImgs[i].src = `${productData[i].img}`
    commodityNames[i].innerText = `${productData[i].productName} ${productData[i].introduce}`
    commodityPrices[i].innerText = `¥${productData[i].price}`
    
    // 点击商品跳转到购买页
    product[i].addEventListener('click', function(){
        purchaseProduct.src = `${productData[i].img}`
        ShowImg.src = `${productData[i].img}`
        LensImg.src = `${productData[i].img}`
        purchaseName.innerText = `${productData[i].productName} ${productData[i].introduce}`
        purchasePrice.innerText = `¥${productData[i].price}`
        Topurchase()
    })
    
    // 点击详情链接跳转到购买页
    infoAlink[i].addEventListener('click', function(){
        purchaseProduct.src = `${productData[i].img}`
        ShowImg.src = `${productData[i].img}`
        LensImg.src = `${productData[i].img}`
        purchaseName.innerText = `${productData[i].productName} ${productData[i].introduce}`
        purchasePrice.innerText = `¥${productData[i].price}`
        Topurchase()
    })
}

// 商品图片放大镜效果
purchaseShow.addEventListener('mouseover', function () {
    mask.style.display = 'block'
    purchaseLens.style.display = 'block'
})

purchaseShow.addEventListener('mouseout', function () {
    mask.style.display = 'none'
    purchaseLens.style.display = 'none'
})

// 放大镜跟随鼠标移动效果
purchaseShow.addEventListener('mousemove', function (e) {
    // 获取鼠标相对于图片容器的位置
    var rect = purchaseShow.getBoundingClientRect()
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top

    // 计算遮罩层位置
    var maskX = x - mask.offsetWidth / 2
    var maskY = y - mask.offsetHeight / 2

    // 限制遮罩层移动范围
    var maxX = purchaseShow.offsetWidth - mask.offsetWidth
    var maxY = purchaseShow.offsetHeight - mask.offsetHeight

    maskX = Math.min(Math.max(0, maskX), maxX)
    maskY = Math.min(Math.max(0, maskY), maxY)

    // 设置遮罩层位置
    mask.style.left = maskX + 'px'
    mask.style.top = maskY + 'px'

    // 计算放大图片位置
    var scaleX = 2 // 放大倍数
    var scaleY = 2
    
    // 计算大图移动距离
    var bigX = (maskX * scaleX)
    var bigY = (maskY * scaleY)

    // 移动放大图片
    LensImg.style.left = -bigX + 'px'
    LensImg.style.top = -bigY + 'px'
})

// 获取账号设置相关元素
const changeInfoModal = document.querySelector('.change-information')
const modifyInfoBtn = document.querySelector('.Modify-information')
const changeCloseBtn = document.querySelector('.change-x')
const avatarUploadInput = document.getElementById('avatar-upload')
const currentAvatar = document.querySelector('.current-avatar')
const changeAvatarBtn = document.querySelector('.change-avatar-btn')
const changeSubmitBtn = document.querySelector('.change-submit')

// 打开账号设置弹窗
modifyInfoBtn.addEventListener('click', function() {
    changeInfoModal.style.display = 'block'
    coverPage.style.display = 'block'
    document.body.style.overflow = 'hidden'
    dropdownContent.style.display = 'none'
})

// 关闭账号设置弹窗
changeCloseBtn.addEventListener('click', function() {
    changeInfoModal.style.display = 'none'
    coverPage.style.display = 'none'
    document.body.style.overflow = 'auto'
})

// 更换头像功能
changeAvatarBtn.addEventListener('click', function() {
    avatarUploadInput.click()
})

// 处理头像上传
avatarUploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = function(e) {
            const newAvatarUrl = e.target.result
            // 更新所有显示头像的地方
            updateAvatars(newAvatarUrl)
            
            // 保存到用户数据
            const currentUser = dropdownUsername.innerText
            const userIndex = users.findIndex(u => u.userName === currentUser)
            if (userIndex !== -1) {
                users[userIndex].avatar = newAvatarUrl
                storeUserArray('users', users)
            }
        }
        reader.readAsDataURL(file)
    }
})

// 保存账号设置修改
changeSubmitBtn.addEventListener('click', function() {
    const newUsername = document.getElementById('change-username').value
    const oldPassword = document.getElementById('old-password').value
    const newPassword = document.getElementById('new-password').value
    const confirmPassword = document.getElementById('confirm-password').value
    
    // 获取当前登录用户
    const currentUser = dropdownUsername.innerText
    const userIndex = users.findIndex(u => u.userName === currentUser)
    
    if (userIndex === -1) {
        alert('用户未找到！')
        return
    }

    // 验证原密码
    if (oldPassword && oldPassword !== users[userIndex].Password) {
        alert('原密码错误！')
        return
    }

    // 验证新密码
    if (newPassword) {
        if (newPassword.length < 6 || newPassword.length > 16) {
            alert('新密码长度应为6-16个字符！')
            return
        }
        if (newPassword !== confirmPassword) {
            alert('两次输入的密码不一致！')
            return
        }
    }

    // 验证新用户名
    if (newUsername) {
        if (newUsername.length < 3 || newUsername.length > 16) {
            alert('用户名长度应为3-16个字符！')
            return
        }
        if (users.some(u => u.userName === newUsername && u.userName !== currentUser)) {
            alert('该用户名已存在！')
            return
        }
    }

    // 更新用户信息
    if (newUsername) {
        users[userIndex].userName = newUsername
        dropdownUsername.innerText = newUsername
    }
    if (newPassword) {
        users[userIndex].Password = newPassword
    }

    // 保存到 localStorage
    storeUserArray('users', users)
    
    alert('修改成功！')
    changeInfoModal.style.display = 'none'
    coverPage.style.display = 'none'
    
    // 清空输入框
    document.getElementById('change-username').value = ''
    document.getElementById('old-password').value = ''
    document.getElementById('new-password').value = ''
    document.getElementById('confirm-password').value = ''
})

// 更新头像显示的函数
function updateAvatars(avatarUrl) {
    document.querySelector('.UserAvatar').src = avatarUrl
    document.querySelector('.dropdownAvatar').src = avatarUrl
    document.querySelector('.current-avatar').src = avatarUrl
}

// 获取搜索框元素
const searchForm = document.querySelector('.Searchbox')
const searchInput = searchForm.querySelector('input[type="text"]')

// 添加搜索表单提交事件监听器
searchForm.addEventListener('submit', function(e) {
    e.preventDefault() // 阻止表单默认提交行为
    
    const searchQuery = searchInput.value.trim()
    if(searchQuery) {
        // 构建必应搜索URL并跳转
        const bingSearchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`
        window.open(bingSearchUrl, '_blank')
    }
})

// 获取通告栏和音频元素
const announcement = document.querySelector('.announcement')
const announcementBtn = document.querySelector('.announcement-btn')
const bgMusic = document.getElementById('bgMusic')

// 页面加载时显示通知栏和遮罩
window.addEventListener('load', function() {
    announcement.style.display = 'flex'
    coverPage.style.display = 'block'
    document.body.style.overflow = 'hidden' // 禁止滚动
})

// 点击确定按钮时关闭通告栏并播放音乐
announcementBtn.addEventListener('click', function() {
    announcement.style.display = 'none'
    coverPage.style.display = 'none'
    document.body.style.overflow = 'auto' // 恢复滚动
    // 尝试播放音频
    bgMusic.play().catch(function(error) {
        console.log("音频播放失败:", error)
    })
})

// 设置音频音量
bgMusic.volume = 0.5 // 设置音量为50%




