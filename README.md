# twitter_full-backend-base
/login - body{email,password}
/signup - body{firstName, lastName, email, password}

QOGAN HAMMASIDA - header{token}

URL - https://thismytwitter.herokuapp.com 

GET
/ - hamma userlani twitlari va twitga yozilgan commentlari
/{postId} - shu posti commentlari
/profile - o'zizi postlariz va postlarizga yozilgan commentlari

POST
/profile - body{post} - post joylash
/comment/{postId} - body{comment} shu postga comment yozish

PUT
/profile/{postId} - body{post} shu postizi o'zgartirish
/comment/{commentId} - body{comment} shu commentizi o'zgartirish
/user - body{firstName, lastName, password} o'zgartirish

DELETE
/profile/{postId} - shu posti o'chirish
/comment/{commentId} - shu commenti o'chirish
/exit - acountni o'chirish
