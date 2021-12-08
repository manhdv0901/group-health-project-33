const user=require('../data');
const findUser=userId=>{
    return user.users.find(user => user.id === userId)
}
const authUser=(req,res,next)=>{
    const {userId}=req.body;
    const user=findUser(userId);
    if(!user){
        res.status(403).json('Sign in!')
    }
    req.user=user;
    next();
}
const authPage= permisson=>{
    return (req,res,next)=>{
        const {role}=req.user;

        if(!permisson.includes(role)){
            return res.status(401).json('You dont have permission')
        }
        next();
    }
}

const authCourse=(req,res,next)=>{
    const {userId}=req.body;
    const {number}=req.params;

    const {courses}=user;
    if(!courses.includes(+number)){
        return res.status(401).json('Not found!')
    }
    next()
}
module.exports={
    authPage,
    authCourse,
    authUser
}