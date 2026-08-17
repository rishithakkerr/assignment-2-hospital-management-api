const mongoose= require('mongoose');

const HospitalSchema={
    name:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    totalBeds:{
        type:Number,
        required:true
    },
    availableBeds:{
        type:Number,
        required:true
    }
};

const Hospital = mongoose.model('Hospital', HospitalSchema);
module.exports=Hospital;
