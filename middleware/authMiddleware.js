const isAuthenticated= (request, response, next)=>{
    if(request.isAuthenticated()){
        return next();
    }
    return response.status(401).json({message:"Please login first"});
};

module.exports=isAuthenticated;
