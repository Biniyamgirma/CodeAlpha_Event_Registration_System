

const test = (req,res)=>{
    console.log("Test endpoint hit");
    res.send("Test endpoint is working");
}

module.exports={
    test
}